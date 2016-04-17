
angular.module('pmApp.LoginCtrl', [])

.controller('LoginController', ['$scope', '$state', 'localStorageService', 'postData', function($scope, $state, localStorageService, postData) {

        var me = this;

        me.userRegister = true;

        me.updateLoginStatus = function(){

          var loginService = localStorageService.get('loginService');

            if(loginService == 'fb') {
                facebookConnectPlugin.getLoginStatus(

                    function(success){

                        if(success.status === 'connected'){
                            me.logged_in = true;
                            $state.go('app.home');

                        } else{
                            me.logged_in = false;
                        }
                    },
                    function(err){
                        me.logged_in = false;
                        console.log("Error while trying to check login status: %s", err);
                    }
                );
            }

            else if(loginService == 'jwt') {
              me.logged_in = true;
              $state.go('app.home');
            }

        };

        me.fbLogin = function(){

                    facebookConnectPlugin.login(['email'], function(success){
                        me.logged_in = true;
                            localStorageService.set('user.id', success.authResponse.userID);
                            localStorageService.set('user.authToken', success.authResponse.accessToken);
                            localStorageService.set('loginService', 'fb');

                            $state.go('app.home');


                    }, function(err){
                        alert('an error occurred while trying to login. please try again.');
                    });


        };

        me.jwtLogin = function() {
          me.jwtlogin = true;
          };

        me.jwtSignIn = function(jwtLoginForm) {

            // SPRAWDZ W DB CZY TAKI USER ISTNIEJE

            postData.findJwtUser({ 'username' : me.authorization.username, 'password' : me.authorization.password })
              .then(function(response) {

                if(response.wrongPassword == true) {
                jwtLoginForm.password.$setValidity("correctPassword", false);

                jwtLoginForm.password.$setViewValue(null);
                jwtLoginForm.password.$render();
                jwtLoginForm.$submitted = false;

                }

                else if(response.userExists == false) {
                  jwtLoginForm.username.$setValidity("wrongUsername", false);
                  jwtLoginForm.password.$setViewValue(null);
                  jwtLoginForm.password.$render();
                  jwtLoginForm.$submitted = false;
                }

                else {

                  me.authorization.username = '';
                  me.authorization.password = '';

                  localStorageService.set('user.id', response.username);
                  localStorageService.set('userDbId', response.userDbId);
                  localStorageService.set('user.authToken', response.userToken);
                  localStorageService.set('loginService', 'jwt');
                  me.logged_in = true;
                  $state.go('app.home');

                }




              });

        };

        me.registerForm = function() {
          $state.go('app.register');
        };

        me.returnHome = function() {
          me.jwtlogin = false;
        }



}]);


