/**
 * Created by pc on 2016-03-30.
 */
angular.module('pmApp.FriendCtrl', [])

.controller('FriendController', ['$scope', '$state', 'localStorageService', 'postData', 'loginOrigin', 'friendList', '$interval', '$q', '$ionicHistory',
  function($scope, $state, localStorageService, postData, loginOrigin, friendList, $interval, $q, $ionicHistory) {

  var me = this;


    $scope.$on('$ionicView.enter', function() {

      console.log('test');

      $interval.cancel(me.friendListInterval);


    });

    $scope.$on('$ionicView.leave', function() {

      console.log('test2');

      $interval.cancel(me.friendListInterval);


    });

    $scope.$on('$ionicView.afterLeave', function() {

      console.log('afterLeave');

      $interval.cancel(me.friendListInterval);


    });

    $scope.$on('$ionicView.beforeLeave', function() {

      console.log('beforeLeave');

      $interval.cancel(me.friendListInterval);


    });

//    me.currentView = $ionicHistory.currentView().stateId;

    me.getUserInfo = function(){

      friendList.getFriendList()
        .then(function(response){
            me.friendList = response.friendList;
            me.receivedInvites = response.receivedInvites;
            me.username = response.username;

          },
          function(error) {
            console.log(error);
          }
        );

      me.startInterval = function() {

        me.friendListInterval = $interval( function() {
          friendList.getFriendList()
            .then(function(response){
              me.friendList = response.friendList;
              me.receivedInvites = response.receivedInvites;
            })

        }, 1000);
      }
    };



  me.inviteUser = function() {

    friendList.sendInvite( { 'friendUsername' : me.userSearch.userField.$modelValue, 'ownUsername' : me.username } )
      .then(function() {
        me.userSearch.userField.$setValidity('friendFinder', true);
        me.inviteSent = true;
        me.userSearch.userField.$setViewValue(null);
        me.userSearch.userField.$render();
      });

  };

    me.acceptInvite = function(chosenUserData) {

      friendList.acceptInvite(chosenUserData)
        .then(function() {
          friendList.getFriendList()
            .then(function(response) {
              me.friendList = response.friendList;
              me.receivedInvites = response.receivedInvites;
            })
        })

    };

}]);
