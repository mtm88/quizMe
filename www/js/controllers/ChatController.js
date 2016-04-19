/**
 * Created by pc on 2016-04-17.
 */
angular.module('pmApp.ChatCtrl', ['monospaced.elastic'])

.controller('ChatController', function($scope, $log, SERVER) {

  var socket = io.connect(SERVER.url); // uzycie server.url jako constant zamiast IP/localhost pomoglo usunac problem z access-control origin !!!!!!!!!!!!!!!



  socket.on('connect_error', function(data) {
    console.log('connect error');
    console.log(data);
  });

  socket.on('connect', function() {
    console.log('connected');
  });

  socket.on('chat message', function(message) {
    console.log('message z serwera: %s', message);
  });


  $scope.$watch('chatInput', function(newValue, oldValue) {
    console.log('chatInput $watch, newValue ' + newValue);
    if(!newValue) newValue = '';
  });

  this.submitChatMsg = function(chatForm) {

    console.log($scope);

    console.log(chatForm);

    $scope.chatLog.value = "test";


    socket.emit('chat message', this.chatInput);

  }


});
