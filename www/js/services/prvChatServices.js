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



    function getPrvChatLogService(message, friendName) {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/submitPrvChatMsg', { token : localData.token, message : message, userDbId : localData.userDbId,
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




    return {

      getPrvChatLogService : getPrvChatLogService

    }



});
