declare const $: any;
declare const gtag: any;

const titles = {
  welcomeTitle: 'Apply for a Merit Invite!',
  waitingForInvite: 'The Merit community is currently reviewing your application.  Good luck!',
  noResponse: 'Bad news.  Your application was rejected. :(',
  userConnected: 'Congratulations! Your application has been approved!',
  joinUs: 'Bummer!  Sorry your invite application did not work out.',
};
const appTitle = $('.chatWindow__title .text'),
  noResponse = $('.noResponse'),
  sendingForm = $('#sendRequest'),
  countDown = $('.countDown'),
  responseWindow = $('.responseWindow'),
  messagesContainer = $('.responseWindow__dialog'),
  navigateToCommunityTab = $('.button.fail, .noResponse__navigator .button.community'),
  failButton = $('.button.fail'),
  communityView = $('.communityView'),
  restartButton = $('.noResponse__navigator .button.try'),
  textareaInvalid = $('#sendRequest.invalid .form__input');
var discordUser: string;

$('document').ready(function() {
  gtag('event', 'Source', { event_category: 'Sources', event_action: 'Load', event_label: '_Merit.me' });
  appTitle.text(titles.welcomeTitle);
});

sendingForm.submit(function(e) {
  e.preventDefault();
  let message = $('textarea[name=message]').val();
  let host = `wss://${window.location.host}/`;
  if (/^localhost/.test(window.location.host)) host = `ws://${window.location.host}/`;
  if (message.length > 74) {
    let socket: any = new WebSocket(host);

    socket.onopen = function() {
      socket.send(message);
      sendingForm.removeClass('invalid').addClass('valid');
      countDown.addClass('active');
      appTitle.text(titles.waitingForInvite);
      requestStatus(socket, 15).then((res: any) => {
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

$(document).keydown(function() {
  if (sendingForm.hasClass('invalid') && $('textarea[name=message]').val().length > 74) {
    sendingForm.removeClass('invalid');
  }
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

failButton.click(() => {
  $('.communityView__gotNothing').show();
  $('.communityView__gotNothing .discordUser').text(discordUser);
});

function requestStatus(socket, remainTime: number) {
  return new Promise(resolve => {
    let remainTimeInMs = remainTime * 60;
    setInterval(() => {
      var t = remainTimeInMs-- * 1000,
        minutes = `${Math.floor(t / 1000 / 60 % 60)}`,
        seconds = `${Math.floor(t / 1000 % 60)}`,
        progress = (remainTime * 60 - remainTimeInMs--) / (remainTime * 60) * 100;
      if (parseFloat(seconds) < 10) seconds = `0${seconds}`;
      if (parseFloat(minutes) < 10) minutes = `0${minutes}`;

      if (t > 0) {
        $('.timer__item.minutes').text(minutes);
        $('.timer__item.seconds').text(seconds);
        $('.dynamic .progress').css('stroke-dasharray', `${progress} 100`);
      } else {
        resolve(new inviteResponse(false, '{author: "Merit", message: "No response"}'));
        $('.timer__item.minutes').text('00');
        $('.timer__item.seconds').text('00');
        $('.dynamic .progress').css('stroke-dasharray', `0 100`);
      }
      socket.send('');
    }, 1000);

    socket.onmessage = function(event) {
      resolve(new inviteResponse(true, event.data));
      defineMessage(messagesContainer, JSON.parse(event.data));
    };
  });
}

function defineMessage(container: any, object: any) {
  if (object.message === 'joined') {
    $('.dialog__item.joined').addClass('active');
    $('.dialog__item.joined .message').text(`@${object.author}`);
    gtag('event', 'Community User', {
      event_category: 'Analytic',
      event_action: 'Connecting',
      event_label: `_@${object.author}_at_Discord`,
    });
    discordUser = object.author;
  } else {
    $('.dialog__item.inviteCode, .button.success').addClass('active');
    $('.button.success').attr('href', `https://wallet.merit.me/?invite=${object.message}`);
    $('.dialog__item.inviteCode .message').html(
      `Your invite link: <a href="https://wallet.merit.me/?invite=${object.message}" target="_blank">${object.message}</a>`
    );
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
