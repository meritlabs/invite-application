declare var $: any;

$('document').ready(function() {
  var socket = new WebSocket('ws://localhost:8999/');
  socket.onopen = function() {
    alert('connected');
  };
  socket.onmessage = function(event) {
    alert(event.data);
  };
});
