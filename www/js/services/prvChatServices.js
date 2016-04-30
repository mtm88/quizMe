angular.module('pmApp.prvChatServices', [])

.service('prvChatService', function($http, SERVER, localStorageService, $q) {

    var FBverified = false;

    function setLocalData() {
      var token = localStorageService.get('user.authToken');
      var userDbId = localStorageService.get('userDbId');
      var loginService = localStorageService.get('loginService');

      var localData = { token : token, userDbId : userDbId, loginService : loginService };
      return localData
    }

    var localData = setLocalData();

    if(localData.loginService == 'fb')
      FBverified = true;



    function getPrvChatLogService(friendName) {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/getPrvChatLog', { token : localData.token, userDbId : localData.userDbId,
        FBverified : FBverified, loginService : localData.loginService, friendName : friendName })
        .success(function(response) {


          deferred.resolve(response);

        })
        .error(function(err) {
          console.log('wystapil blad w getPrvChatLog');
          console.log(err);
        });

      return deferred.promise;

    }

    function sendPrvChatMsgService(ownUsername, friendUsername, message) {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/sendPrvChatLogMsg', { token : localData.token, loginService : localData.loginService, FBverified : FBverified,
        userDbId : localData.userDbId, friendUsername : friendUsername, message : message, ownUsername : ownUsername })
        .success(function(response) {

          deferred.resolve(response);

        })
        .error(function(error){

          console.log('blad przy wysylaniu wiadomosci w service');
          console.log(error);
          deferred.reject(error);

        });

      return deferred.promise;


    }




    return {

      getPrvChatLogService : getPrvChatLogService,
      sendPrvChatMsgService : sendPrvChatMsgService

    }



});
