angular.module('pmApp.friendList', [])

.service('friendList', ['$http', '$q', 'localStorageService', 'SERVER',
  function($http, $q, localStorageService, SERVER) {

    function setLocalData() {
      var token = localStorageService.get('user.authToken');
      var userDbId = localStorageService.get('userDbId');
      var loginService = localStorageService.get('loginService');

    var localData = { token : token, userDbId : userDbId, loginService : loginService };
      return localData
    }



    function setOnlineStatus(userDbId, token, status) {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/setOnlineStatus', ({ userDbId : userDbId, token : token, status : status }))
        .success(function(response) {
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


      var localData = setLocalData();


      if(localData.loginService == 'fb')
        FBverified = true;


    $http.post(SERVER.url + '/api/getFriendlist', ({ userDbId : localData.userDbId, loginService: localData.loginService, token : localData.token, FBverified : FBverified }))
      .success(function(response){

       deferred.resolve(response);

      })
      .error(function(error) {

        console.log(error);
        deferred.reject();

      });

      return deferred.promise;

  }

    function acceptInvite(chosenUserData) {

      var localData = setLocalData();
      FBverified = false;

      if(localData.loginService == 'fb')
        FBverified = true;

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/acceptInvite', { chosenUserData : chosenUserData, token : localData.token, loginService : localData.loginService, userDbId : localData.userDbId, FBverified : FBverified })
        .success(function(response) {

          console.log(response);

          if(response.friendAdded == true)
             deferred.resolve();



        })
        .error(function(err) {
          console.log(err);
          deferred.reject(err)
        });

      return deferred.promise;

    }


    function sendInvite(chosenUserData) {


      var localData = setLocalData();

      if(localData.loginService == 'fb')
        var FBverified = true;


      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/sendInvite', { chosenUserData : chosenUserData, FBverified : FBverified, token : localData.token,
        loginService : localData.loginService, sendingUserDbId : localData.userDbId, sendingUsername : chosenUserData.ownUsername })
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
    setOnlineStatus : setOnlineStatus,
    sendInvite : sendInvite,
    acceptInvite : acceptInvite,

    setLocalToken : setLocalData

  }



}]);
