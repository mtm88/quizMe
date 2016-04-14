angular.module('pmApp.friendList', [])

.service('friendList', ['$http', '$q', 'localStorageService', 'SERVER',
  function($http, $q, localStorageService, SERVER) {



    function setOnlineStatus(userDbId, token, status) {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/setOnlineStatus', ({ userDbId : userDbId, token : token, status : status }))
        .success(function(response) {

          console.log(response);

          deferred.resolve(response);

        })
        .error(function(err) {
          if(err) throw err;
          deferred.reject();
        });

      return deferred.promise;

    }

    function getFriendList() {

    var deferred = $q.defer();

    var FBverified = false;

    var userDbId = localStorageService.get('userDbId');
    var loginService = localStorageService.get('loginService');
    var token = localStorageService.get('user.authToken');


      if(loginService == 'fb')
        FBverified = true;


    $http.post(SERVER.url + '/api/getFriendlist', ({ userDbId : userDbId, loginService: loginService, token : token, FBverified : FBverified }))
      .success(function(response){

       deferred.resolve(response);

      })
      .error(function(error) {

        console.log(error);
        deferred.reject();

      });

      return deferred.promise;

  }


    function sendInvite(chosenUserData, userData) {

      var sendingUserDbId = localStorageService.get('userDbId');
      var token = localStorageService.get('user.authToken');
      var loginService = localStorageService.get('loginService');

      if(loginService == 'fb') {
        var FBverified = true;
        var username = userData.email;
      }
      else {
        var username = userData.username;
      }

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/sendInvite', { chosenUserData : chosenUserData, FBverified : FBverified, token : token,
        loginService : loginService, sendingUserDbId : sendingUserDbId, sendingUsername : username })
        .success(function(response) {

          if(response.success == true)
          deferred.resolve(response);

          else {
            console.log('Failed to send request');
            deferred.reject();
          }

        })
        .error(function(error) {
          console.log(error);
          deferred.reject();
        });

      return deferred.promise;

    }

  return {

    getFriendList : getFriendList,
    setOnlineStatus: setOnlineStatus,
    sendInvite: sendInvite

  }



}]);
