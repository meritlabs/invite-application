declare var $: any;

const titles = {
  welcomeTitle: 'Welcome to the Merit Inite Application!',
  waitingForInvite: 'Your messasge has been sent to community. Good luck!',
  noResponse: 'No luck :(',
};
const appTitle = $('.chatWindow__title .text'),
  noResponse = $('.noResponse'),
  sendingForm = $('#sendRequest'),
  countDown = $('.countDown');

$('document').ready(function() {
  appTitle.text(titles.welcomeTitle);
  sendingForm.submit(function(e) {
    e.preventDefault();
    let message = $('textarea[name=message]').val();
    if (message.length > 1) {
      const socket: any = new WebSocket('ws://localhost:8999/');
      socket.onopen = function() {
        // socket.send(message);
        sendingForm.removeClass('invalid').addClass('valid');
        countDown.addClass('active');
        appTitle.text(titles.waitingForInvite);
        requestStatus(0.5).then(res => {
          if (!res) {
            appTitle.text(titles.noResponse);
            countDown.removeClass('active');
            noResponse.addClass('active');
          }
        });
      };
    } else {
      sendingForm.addClass('invalid').removeClass('valid');
    }
  });
});

function requestStatus(remainTime: number) {
  return new Promise((resolve, reject) => {
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
        $('.dinamyc .progress').css('stroke-dasharray', `${progress} 100`);
      } else {
        clearInterval(interval);
        resolve(false);
      }
    }, 1000);
  });
}
