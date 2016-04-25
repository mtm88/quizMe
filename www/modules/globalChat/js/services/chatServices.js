angular.module('pmApp.chatServices', [])

.service('chatService', function(SERVER, $http, localStorageService, $q, $ionicLoading) {

  function setLocalData() {
    var token = localStorageService.get('user.authToken');
    var userDbId = localStorageService.get('userDbId');
    var loginService = localStorageService.get('loginService');

    var localData = { token : token, userDbId : userDbId, loginService : loginService };
    return localData
  }

  var FBverified = false;


  var localData = setLocalData();


  if(localData.loginService == 'fb')
    FBverified = true;


  function getChatLog() {

    $ionicLoading.show();

    var messages = [];

    var deferred = $q.defer();

    $http.post(SERVER.url + '/api/getChatLog', ({ token: localData.token, FBverified : FBverified }))
      .success(function (response) {

        var definedLength = null;

        if(response.length < 10)
          definedLength = 0;
        else
          definedLength = response.length - 5;


        for( i = definedLength ; i < response.length ; i++) {
          messages.push(response[i]);
        }

        deferred.resolve(messages);
        $ionicLoading.hide();


      })
      .error(function (error) {
        console.log(error);
        deferred.reject(error);
        $ionicLoading.hide();
      });

    return deferred.promise;

  }


  return {

    getChatLog : getChatLog

  }

});
