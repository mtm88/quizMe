/**
 * Created by pc on 2016-03-30.
 */
angular.module('pmApp.FriendCtrl', [])

.controller('FriendController', ['$scope', '$state', 'localStorageService', 'postData', 'loginOrigin', 'friendList', '$interval', '$q', '$ionicHistory',
  function($scope, $state, localStorageService, postData, loginOrigin, friendList, $interval, $q, $ionicHistory) {

  var me = this;

     $scope.$on('$destroy', function() {
       $interval.cancel(me.friendListInterval);
     });



//    me.currentView = $ionicHistory.currentView().stateId;

    me.getUserInfo = function(){

      friendList.getFriendList()
        .then(function(response){
            me.friendList = response.friendList;
            me.receivedInvites = response.receivedInvites;
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

    var username = localStorageService.get('username');

    friendList.sendInvite( { 'friendUsername' : me.userSearch.userField.$modelValue, 'ownUsername' : username } )
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
