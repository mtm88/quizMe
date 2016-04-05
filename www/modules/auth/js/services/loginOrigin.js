/**
 * Created by pc on 2016-03-30.
 */
angular.module('pmApp.loginOriginService', [])

.service('loginOrigin', ['$http', '$q', '$ionicLoading', 'localStorageService',
  function($http, $q, $ionicLoading, localStorageService) {

  var me = this;

      function checkLoginOrigin() {

        $ionicLoading.show();

        var deferred = $q.defer();

      var loginService = localStorageService.get('loginService');
      var user_id = localStorageService.get('user.id');
      var authToken = localStorageService.get('user.authToken');

        if(loginService == 'fb') {

          $http.get('https://graph.facebook.com/me?access_token=' + authToken)
            .success(function(response) {
              if(user_id === response.id){
                console.log("Weryfikacja uzytkownika FB pomyslna");
                deferred.resolve('fb');
                $ionicLoading.hide();
              }
              else {
                console.log("Weryfikacja uzytkownika FB niepomyslna");
                deferred.resolve(null);
              }
            })
            .error(function(){
                deferred.reject();
            });

          return deferred.promise;

        }

        else if(loginService == 'jwt') {

          console.log("Uzytkownik zalogowany przez JWT.");
          deferred.resolve('jwt');
          $ionicLoading.hide();
          return deferred.promise;

        }

        else {
          deferred.reject('Nie rozpoznano loginService(nie jest fb ani jwt)');
        }

      }

          return {
            checkLoginOrigin: checkLoginOrigin
          }

}]);

