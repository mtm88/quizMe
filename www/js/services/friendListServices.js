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

    var userDbId = localStorageService.get('userDbId');

  }

  return {

    getFriendList : getFriendList,
    setOnlineStatus: setOnlineStatus

  }



}]);
