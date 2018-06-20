declare var $: any;

const titles = {
  welcomeTitle: 'Welcome to the Merit Invite Application!',
  waitingForInvite: 'Your message has been sent to community. Good luck!',
  noResponse: 'No luck :(',
  userConnected: 'Congrats! Your request accepted!',
  joinUs: 'Join US!',
};
const appTitle = $('.chatWindow__title .text'),
  noResponse = $('.noResponse'),
  sendingForm = $('#sendRequest'),
  countDown = $('.countDown'),
  responseWindow = $('.responseWindow'),
  messagesContainer = $('.responseWindow__dialog'),
  navigateToCommunityTab = $('.button.fail, .noResponse__navigator .button.community'),
  communityView = $('.communityView'),
  restartButton = $('.noResponse__navigator .button.try');

$('document').ready(function() {
  appTitle.text(titles.welcomeTitle);
  sendingForm.submit(function(e) {
    e.preventDefault();
    let message = $('textarea[name=message]').val();
    let host = `wss://${window.location.host}/`;
    if (/^localhost/.test(window.location.host)) host = `ws://${window.location.host}/`;
    if (message.length > 1) {
      let socket: any = new WebSocket(host);

      socket.onopen = function() {
        socket.send(message);
        sendingForm.removeClass('invalid').addClass('valid');
        countDown.addClass('active');
        appTitle.text(titles.waitingForInvite);
        requestStatus(socket, 5).then((res: any) => {
          if (!res.status) {
            appTitle.text(titles.noResponse);
            countDown.removeClass('active');
            noResponse.addClass('active');
          } else {
            countDown.removeClass('active');
            appTitle.text(titles.userConnected);
            responseWindow.addClass('active');
          }
        });
      };
    } else {
      sendingForm.addClass('invalid').removeClass('valid');
    }
  });
});

navigateToCommunityTab.click(() => {
  appTitle.text(titles.joinUs);
  responseWindow.removeClass('active');
  noResponse.removeClass('active');
  communityView.addClass('active');
});

restartButton.click(() => {
  appTitle.text(titles.welcomeTitle);
  noResponse.removeClass('active');
  sendingForm.removeClass('valid');
});

function requestStatus(socket, remainTime: number) {
  return new Promise(resolve => {
    let remainTimeInMs = remainTime * 60;
    let interval = setInterval(() => {
      var t = remainTimeInMs-- * 1000,
        minutes = `0${Math.floor(t / 1000 / 60 % 60)}`,
        seconds = `${Math.floor(t / 1000 % 60)}`,
        progress = (remainTime * 60 - remainTimeInMs--) / (remainTime * 60) * 100;
      if (parseFloat(seconds) < 10) seconds = `0${seconds}`;

      if (t > 0) {
        $('.timer__item.minutes').text(minutes);
        $('.timer__item.seconds').text(seconds);
        $('.dynamic .progress').css('stroke-dasharray', `${progress} 100`);
      } else {
        clearInterval(interval);
        resolve(new inviteResponse(false, '{author: "Merit", message: "No response"}'));
        $('.timer__item.minutes').text('00');
        $('.timer__item.seconds').text('00');
        $('.dynamic .progress').css('stroke-dasharray', `0 100`);
      }
    }, 1000);
    socket.onmessage = function(event) {
      if (interval) {
        clearInterval(interval);
      }
      resolve(new inviteResponse(true, event.data));
      defineMessage(messagesContainer, JSON.parse(event.data));
    };
  });
}

function defineMessage(container: any, object: any) {
  if (object.message === 'joined') {
    $('.dialog__item.joined').addClass('active');
    $('.dialog__item.joined .message').text(`@${object.author}`);
    $('.dialog__item.joined .time').text(new Date().getTime());
  } else {
    $('.dialog__item.inviteCode, .button.success').addClass('active');
    $('.button.success').attr('href', `https://wallet.merit.me/?invite=${object.message}`);
    $('.dialog__item.inviteCode .message').html(
      `Your invite link: <a href="https://wallet.merit.me/?invite=${object.message}" target="_blank">${object.message}</a>`
    );
    $('.dialog__item.inviteCode .time').text(new Date().getTime());
  }
}

// Class for invite response for form messenger
class inviteResponse {
  status: boolean;
  message: string;
  constructor(status: boolean, message: string) {
    this.status = status;
    this.message = message;
  }
}
