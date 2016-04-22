/**
 * Created by pc on 2016-04-17.
 */
angular.module('pmApp.ChatCtrl', ['monospaced.elastic'])

.controller('ChatController', function($scope, $log, CHAT, localStorageService, $rootScope, $ionicScrollDelegate) {

  $scope.$on('$ionicView.enter', function() {
    console.log('UserMessages $ionicView.enter');
  });

  $scope.$on('$destroy', function() {
    console.log('scope destroy');
    socket.disconnect();
  })




  var socket = io.connect(CHAT.url); // uzycie server.url jako constant zamiast IP/localhost pomoglo usunac problem z access-control origin !!!!!!!!!!!!!!!

  socket.on('connect_error', function(data) {
    console.log('connect error');
    console.log(data);
  });

  /* socket.on('connect', function() {
    console.log('connected');
  }); */

  socket.on('chat message', function(message) {

    var currentTime = new Date().toLocaleTimeString();

    var messageData = {
      user: message.user,
      message: message.message,
      timeAdded: currentTime
    };

    $scope.chat_ctrl.messages.push(messageData);
    $scope.$apply();
    $ionicScrollDelegate.scrollBottom(true);

  });

  socket.on('chat log', function(chatLog) {

    for( i = chatLog.length - 5 ; i < chatLog.length ; i++) {
      $scope.chat_ctrl.messages.push(chatLog[i]);
    }
    $scope.$apply();
    $ionicScrollDelegate.scrollBottom(true);
  });

  socket.on('users online', function(usersOnline) {
    console.log('Users online: %s', usersOnline);
    $scope.chat_ctrl.usersOnline = usersOnline;
  });


  if(!this.messages)
    this.messages = [];

  var username = localStorageService.get('username');

  this.submitChatMsg = function() {
    var currentTime = new Date().toLocaleTimeString();
    var message = { 'user' : username, 'message' : this.chatInput, timeAdded: currentTime };
    socket.emit('chat message', message);
    this.chatInput = '';

  };

  this.getChatLog = function() {
    socket.emit('get chat log')
  };


});

