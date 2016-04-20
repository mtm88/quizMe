/**
 * Created by pc on 2016-04-17.
 */
angular.module('pmApp.ChatCtrl', ['monospaced.elastic'])

.controller('ChatController', function($scope, $log, SERVER, localStorageService, $rootScope) {

  var socket = io.connect(SERVER.url); // uzycie server.url jako constant zamiast IP/localhost pomoglo usunac problem z access-control origin !!!!!!!!!!!!!!!

  socket.on('connect_error', function(data) {
    console.log('connect error');
    console.log(data);
  });

  socket.on('connect', function() {
    console.log('connected');
  });

  socket.on('chat message', function(message) {

    console.log('message received at client');

    $scope.chat_ctrl.messages.push(message);
    $scope.$apply();

  });

  socket.on('chat log', function(chatLog) {
    console.log('message received at client');
    for( i = 0 ; i < chatLog.length ; i++) {
      $scope.chat_ctrl.messages.push(chatLog[i]);
    }
    $scope.$apply();
  });


  if(!this.messages)
    this.messages = [];

  var user_id = localStorageService.get('user.id');
  var username = localStorageService.get('username');

  $scope.$watch('chat_ctrl.chatInput', function(newValue, oldValue) {
    if(!newValue) newValue = '';
    console.log('chatInput $watch, newValue ' + newValue);

  });

  this.submitChatMsg = function() {

    var message = { 'user' : username, 'message' : this.chatInput };

    socket.emit('chat message', message);

  }

  this.getChatLog = function() {

    console.log('wysylam request po historie');
    socket.emit('get chat log')

  };



});

