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

var queryDict = {};

location.search.substr(1).split('&').forEach(function(item) {
  queryDict[item.split('=')[0]] = item.split('=')[1];
});

var discordUser: string;
var PARAMS: any;
var SOURCE: string = (queryDict as any).source;

function getParams() {
  return new Promise(response => {
    let host = `https://${window.location.host}/`;
    if (/^localhost/.test(window.location.host)) host = `http://${window.location.host}/`;
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${host}application`);
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        response(data);
      }
    };
    xhr.send();
  });
}

(async () => {
  PARAMS = await getParams();

  $('document').ready(function() {
    gtag('event', 'Source', {
      event_category: 'Sources',
      event_action: 'Load',
      event_label: `_${SOURCE}`,
      value: 0, // Application loaded
    });

    appTitle.text(titles.welcomeTitle);

    if ((queryDict as any).autoMessage) {
      let autoMessage = decodeURI((queryDict as any).autoMessage);
      $('textarea[name=message]').val(autoMessage);
      sendingForm.submit();
    }
  });

  sendingForm.submit(function(e) {
    e.preventDefault();
    let message = $('textarea[name=message]').val();
    let host = `wss://${window.location.host}/`;
    let validateMessage = validateApplication(message);
    if (/^localhost/.test(window.location.host)) host = `ws://${window.location.host}/`;
    if (validateMessage === 'valid') {
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
      $('.invalidMessage').text(validateMessage);
      sendingForm.addClass('invalid').removeClass('valid');
    }
  });

  $(document).keydown(function() {
    if (sendingForm.hasClass('invalid') && $('textarea[name=message]').val().length > 74) {
      sendingForm.removeClass('invalid');
    }
  });

  navigateToCommunityTab.click(() => {
    gtag('event', 'Source', {
      event_category: 'Sources',
      event_action: 'Load',
      event_label: `_${SOURCE}`,
      value: 2, // User got response but didn't get code from connected user
    });

    appTitle.text(titles.joinUs);
    responseWindow.removeClass('active');
    noResponse.removeClass('active');
    communityView.addClass('active');
  });

  restartButton.click(() => {
    gtag('event', 'Source', {
      event_category: 'Sources',
      event_action: 'Load',
      event_label: `_${SOURCE}`,
      value: 1, // User didn't get response from community
    });

    appTitle.text(titles.welcomeTitle);
    noResponse.removeClass('active');
    sendingForm.removeClass('valid');
  });

  failButton.click(() => {
    gtag('event', 'Community User', {
      event_category: 'Analytic',
      event_action: 'Connecting',
      event_label: `_@${discordUser}_at_Discord`,
      value: 2,
    });

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
      discordUser = object.author;

      gtag('event', 'Community User', {
        event_category: 'Analytic',
        event_action: 'Connecting',
        event_label: `_@${object.author}_at_Discord`,
        value: 0,
      });

      $('.dialog__item.joined').addClass('active');
      $('.dialog__item.joined .message').text(`@${object.author}`);
    } else {
      gtag('event', 'Community User', {
        event_category: 'Analytic',
        event_action: 'Connecting',
        event_label: `_@${object.author}_at_Discord`,
        value: 1,
      });

      let linkTarget = '_blank';

      if (SOURCE === 'dlw') linkTarget = '_parent';

      $('.dialog__item.inviteCode, .button.success').addClass('active');

      $('.button.success')
        .attr('href', `${(PARAMS as any).wallet_app}?invite=${object.message}`)
        .attr('target', linkTarget);
      $('.dialog__item.inviteCode .message').html(
        `Your invite link: <a href="${(PARAMS as any)
          .wallet_app}?invite=${object.message}" target="${linkTarget}">${object.message}</a>`
      );
    }
  }

  function validateApplication(value) {
    let status = 'valid';
    let isMnemonic = value.split(' ').length;
    let punctuationTest = new RegExp(/[:.,!@$%;'"/#&]/g).test(value);

    if (value.length < 74) {
      status = `Minimum application length: 75 characters.`;
    }
    if (isMnemonic === 12 && !punctuationTest) {
      status = `Looks like you entered a secret mnemonic phrase. 
      Be careful and never show this phrase to anybody, 
      remember if you forget these 12 words you will lose your wallet!`;
    }
    return status;
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
})();
