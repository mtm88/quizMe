/**
 * Created by pc on 2016-03-30.
 */
angular.module('pmApp.HomeCtrl', [])

.controller('HomeController', ['$scope', '$state', 'localStorageService', 'postData', 'loginOrigin', 'friendList',
  function($scope, $state, localStorageService, postData, loginOrigin, friendList) {

  var me = this;

  $scope.userDetails = null;

  me.getUserInfo = function(){

    loginOrigin.checkLoginOrigin()
      .then(function(respond) {

        if(respond == 'fb') {

          var FBuser_id = localStorageService.get('user.id');
          var FBtoken = localStorageService.get('user.authToken');
          var FBverified = true;
          var userOrigin = 'fb';

          facebookConnectPlugin.api(
            FBuser_id + "/?fields=picture,id,email,first_name,last_name,gender,age_range",
            ['public_profile', 'email'],
            function (successData) {
              postData.findFbUser(successData, FBtoken, FBverified, userOrigin)
                .then( function(response) {
                  me.userDetails = successData;
                  localStorageService.set('userDbId', response._id);
                  friendList.getFriendList();
                });

            },
            function (error) {
              console.log(error);
            }
          );

        }

        else if(respond == 'jwt') {

          me.jwtUserName = localStorageService.get('user.id');
          friendList.getFriendList();

        }



      });

  };














  $scope.Logout = function(){

    this.loginServiceCheck = localStorageService.get('loginService');

    if(this.loginServiceCheck == 'fb') {
        facebookConnectPlugin.logout(
          function(){
            console.log('FB Logout successfull');
            $scope.logged_in = false;
            localStorageService.set('loginService', null);
            localStorageService.set('user.authToken', null);
            $state.go('app.login');
          },
          function(err){
            console.log('Logout failed: %s', err);
          }
        );
    } else {
      localStorageService.set('loginService', null);
      localStorageService.set('user.authToken', null);
      me.logged_in = false;
      $state.go('app.login');
      console.log('JWT Logout successfull');
    }

  };



}])
