/**
 * Created by pc on 2016-03-30.
 */
angular.module('pmApp.HomeCtrl', [])

.controller('HomeController', ['$scope', '$state', 'localStorageService', 'postData', 'loginOrigin', 'friendList', '$interval', '$q',
  function($scope, $state, localStorageService, postData, loginOrigin, friendList, $interval, $q) {

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

                  $scope.userDetails = successData;

                  setUserDbId();

                  function setUserDbId() {

                  var deferred = $q.defer();
                    if(response) {
                      localStorageService.set('userDbId', response._id);
                      deferred.resolve();
                    } else {
                      deferred.reject();
                    }
                    return deferred.promise;
                  }

                });

            },
            function (error) {
              console.log(error);
            }
          );

        }

        else if(respond == 'jwt') {
          $scope.userDetails =  { 'username' : localStorageService.get('user.id') };
        }

      });

  };


  me.logout = function(){

    this.loginServiceCheck = localStorageService.get('loginService');

    $interval.cancel(me.friendListInterval);

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
      localStorageService.set('userDbId', null);
      localStorageService.set('user.authToken', null);
      me.logged_in = false;
      $state.go('app.login');
      console.log('JWT Logout successfull');
    }

  };



}]);
