/**
 * Created by pc on 2016-04-22.
 */

angular.module('pmApp.PrivateChatCtrl', [])


.controller('PrivateChatController', function($scope, $stateParams, $ionicHistory, $timeout) {

  

  this.friendName = $stateParams.username;


  $scope.$on('$ionicView.enter', function() {
    console.log('UserMessages $ionicView.enter');
  });







  this.goBack = function() {
    $ionicHistory.goBack();
  }


})
