/**
 * Created by pc on 2016-04-22.
 */

angular.module('pmApp.PrivateChatCtrl', ['pmApp.prvChatServices'])


.controller('PrivateChatController', function($scope, $stateParams, prvChatService, $ionicHistory) {


  this.friendName = $stateParams.username;


  $scope.$on('$ionicView.enter', function() {
    console.log('UserMessages $ionicView.enter');
  });


    this.getPrvChatLog = function() {

      console.log('1');

      prvChatService.getPrvChatLogService(this.prvChatInput, this.friendName)
        .then(function(receivedData) {

          $scope.prvChat_ctrl.prvChatLog = receivedData[0].chatLog;
          console.log(receivedData[0].chatLog);

        });

      this.prvChatInput = '';
    };







  this.goBack = function() {
    $ionicHistory.goBack();
  }


});
