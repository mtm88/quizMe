angular.module('pmApp.postDataServices', [])
        .service('postData', ['$http', '$q', '$ionicLoading', '$timeout', '$ionicPopup', 'SERVER',
            function($http, $q, $ionicLoading, $timeout, $ionicPopup, SERVER) {


        var me = this;

        me.timeout = {
            value: 20000,
            message: 'Connection timeout (20000)'
        };

        function requestTimeout(deferred) {

            var timer = $timeout(function() {

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'timeout przekroczony'
                });

                deferred.reject();
            }, me.timeout.value);

            return timer;

        }

              function registerUser(newUserData) {

                console.log(newUserData);

                $ionicLoading.show();

                var deferred = $q.defer();

                var timer = requestTimeout(deferred);

                $http.post(SERVER.url + '/api/registerNewUser', { newUserData : newUserData })
                  .success( function(success) {

                    $timeout.cancel(timer);
                    $ionicLoading.hide();

                    deferred.resolve(success);

                  })

                  .error( function(err) {
                    if(err) throw err;
                    deferred.reject(err);
                  });

                return deferred.promise;

              }



              function findJwtUser(userData) {

                $ionicLoading.show();

                var deferred = $q.defer();

                var timer = requestTimeout(deferred);

                $http.post(SERVER.url + '/api/jwtUserLogin', { data : userData })
                  .success( function(response) {

                    $timeout.cancel(timer);
                    $ionicLoading.hide();

                    deferred.resolve(response);

                  })
                  .error(function(err) {
                    if(err) throw err;
                    deferred.reject();
                  });

                return deferred.promise;
              }



        function findFbUser(userData, token_fb, FBverified, userOrigin) {
console.log(FBverified);
          $ionicLoading.show();

          var deferred = $q.defer();

          var timer = requestTimeout(deferred);

            $http.post(SERVER.url + '/api/fbUserData', { data : userData, token_fb : token_fb, FBverified : FBverified, userOrigin: userOrigin })
                .success(function(response){

                  if(response._id == null) {
                    console.log("New user");
                  } else {
                    console.log("User already existed");
                  }

                    $timeout.cancel(timer);
                    $ionicLoading.hide();

                    deferred.resolve(response);

                })
                .error(function(){
                    deferred.reject();
                });

            return deferred.promise;

        }

                return {
                    findFbUser: findFbUser,
                    findJwtUser: findJwtUser,
                    registerUser: registerUser
                }

}]);



