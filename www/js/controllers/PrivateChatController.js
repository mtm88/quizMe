/**
 * Created by pc on 2016-04-22.
 */

angular.module('pmApp.PrivateChatCtrl', ['pmApp.prvChatServices', 'angularMoment'])


.controller('PrivateChatController', function($scope, $stateParams, prvChatService, $ionicHistory, localStorageService, $ionicScrollDelegate, $interval) {


  this.friendName = $stateParams.username;

  this.userDbId = localStorageService.get('userDbId');
  this.ownUsername = localStorageService.get('username');

  var viewScroll = $ionicScrollDelegate.$getByHandle('privateChatScroll');
  var footerBar = document.body.querySelector('#prvChatView .bar-footer');
  var txtInput = angular.element(footerBar.querySelector('textarea'));


    $scope.$on('$ionicView.beforeLeave', function() {
      $interval.cancel(this.prvChatInterval);
      console.log('destroying interval');
    });

    $scope.$on('$ionicView.enter', function() {

        this.prvChatInterval = $interval( function() {
          console.log('starting interval');

          prvChatService.getPrvChatLogService($stateParams.username)
            .then(function(receivedData) {
              if(receivedData == ''){
                $scope.prvChat_ctrl.noChatLog = "No messages yet";
              }
              else {
                $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
                viewScroll.scrollBottom();
              }
            });


        }, 5000);


  });


    this.getPrvChatLog = function() {
      prvChatService.getPrvChatLogService(this.friendName)
        .then(function(receivedData) {
          if(receivedData == ''){
            $scope.prvChat_ctrl.noChatLog = "No messages yet";
          }
          else {
          $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
          viewScroll.scrollBottom();
          }
        });

      this.prvChatInput = '';
    };


    this.sendPrvChatMsg = function() {


      keepKeyboardOpen();
      prvChatService.sendPrvChatMsgService(this.ownUsername, this.friendName, this.prvChatInput)
        .then(function() {
          prvChatService.getPrvChatLogService($stateParams.username)
            .then(function(receivedData) {
             $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
              viewScroll.scrollBottom();

            })


        });

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
