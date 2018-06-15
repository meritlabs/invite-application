declare var $: any;

$('document').ready(function() {
  let socket;
  $('#sendRequest').submit(function(e) {
    e.preventDefault();
    let message = $('textarea[name=message]').val();
    if (message.length > 150) {
      socket = new WebSocket('ws://localhost:8999/');

      socket.onopen = function() {
        console.log('connected');
        socket.send(message);
      };
    }
  });
});
