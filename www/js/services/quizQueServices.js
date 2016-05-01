angular.module('pmApp.quizQueServices', [])


.service('quizQueServices', function($http, localStorageService, SERVER, $q) {

    var FBverified = false;

    function setLocalData() {
      var token = localStorageService.get('user.authToken');
      var userDbId = localStorageService.get('userDbId');
      var loginService = localStorageService.get('loginService');
      var username = localStorageService.get('username');

      var localData = { token : token, userDbId : userDbId, loginService : loginService, username : username };
      return localData
    }

    var localData = setLocalData();

    if(localData.loginService == 'fb')
      FBverified = true;


  function addToQue(difficulty) {

    var deferred = $q.defer();

    $http.post(SERVER.url + '/api/addUserToQue', { 'username' : localData.username, 'userDbId' : localData.userDbId, 'difficulty' : difficulty, 'token' : localData.token,
    'loginService' : localData.loginService, 'FBverified' : FBverified })
      .success(function() {
        deferred.resolve('User dodany do que');
      })
      .error(function(err) {
        deferred.reject();
        console.log('blad przy post na addToQue');
        console.log(err);
      });
    return deferred.promise;
  }

    function removeFromQue() {

      var deferred = $q.defer();

      $http.post(SERVER.url + '/api/removeUserFromQue', { 'username' : localData.username, 'token' : localData.token, 'FBverified' : FBverified })
        .success(function() {
          deferred.resolve('User usuniety z Que');
        })
        .error(function(err) {
          console.log('blad przy usuwaniu usera z que');
          deferred.reject(err);
        });

      return deferred.promise;

    }




    return {

      addToQue : addToQue,
      removeFromQue : removeFromQue

    }



  });
