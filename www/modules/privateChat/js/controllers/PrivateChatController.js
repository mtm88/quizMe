/**
 * Created by pc on 2016-04-22.
 */

angular.module('pmApp.PrivateChatCtrl', ['pmApp.prvChatServices', 'angularMoment'])


.controller('PrivateChatController', function($scope, $stateParams, prvChatService, $ionicHistory,
                                              localStorageService, $ionicScrollDelegate, $interval, $ionicLoading, PRIVATECHAT) {

  var userDbId = localStorageService.get('userDbId');
  var loginService = localStorageService.get('loginService');

  var socket = io.connect(PRIVATECHAT.url);

    socket.on('connect_error', function(data) {
      console.log('connect error');
      console.log(data);
    });

    socket.on('connect', function() {
      console.log('connected');
    });

    socket.on('private chat message from server', function(message) {

      var currentTime = new Date().toISOString();

      var messageData = {
        userID: message.userDbId,
        user: message.user,
        message: message.message,
        timeAdded: currentTime
      };

      $scope.prvChat_ctrl.prvChatLog.push(messageData);
      $scope.$apply();
      viewScroll.scrollBottom();

    });


  this.friendName = $stateParams.username;

  this.userDbId = localStorageService.get('userDbId');
  this.ownUsername = localStorageService.get('username');

  var viewScroll = $ionicScrollDelegate.$getByHandle('privateChatScroll');
  var footerBar = document.body.querySelector('#prvChatView .bar-footer');
  var txtInput = angular.element(footerBar.querySelector('textarea'));


    $scope.$on('$ionicView.beforeLeave', function() {
      socket.emit('end');
      $interval.cancel(this.prvChatInterval);
      console.log('destroying interval');
    });

    $scope.$on('$ionicView.enter', function() {


  });


    this.getPrvChatLog = function() {

      $ionicLoading.show();
      prvChatService.getPrvChatLogService(this.friendName)
        .then(function(receivedData) {
          if(receivedData == ''){
            $scope.prvChat_ctrl.noChatLog = "No messages yet";
            $scope.prvChat_ctrl.prvChatLog = [];
          }
          else {
          $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
          viewScroll.scrollBottom();
          }
          $ionicLoading.hide();
        });

    };


    this.sendPrvChatMsg = function() {

      keepKeyboardOpen();

      var prvChatMessage = { ownUsername : this.ownUsername, friendName : this.friendName, message : this.prvChatInput, userDbId : userDbId, loginService : loginService };
      console.log(prvChatMessage);
      socket.emit('private chat message to server', prvChatMessage);

   /*   prvChatService.sendPrvChatMsgService(this.ownUsername, this.friendName, this.prvChatInput)
        .then(function() {
          prvChatService.getPrvChatLogService($stateParams.username)
            .then(function(receivedData) {
             $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
              viewScroll.scrollBottom();

            })


        });
    */

      this.prvChatInput = '';


    };







    this.goBack = function() {
      $ionicHistory.goBack();
    };

    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.on('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }


});
