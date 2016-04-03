angular.module('pmApp.RegisterCtrl', [])

.controller('RegisterController', ['$state', 'postData', 'localStorageService', function($state, postData, localStorageService) {


 var me = this;

  me.register = function() {

    postData.registerUser({ username : me.registration.username, password : me.registration.password })
      .then( function(newUser) {

       console.log(newUser);

        localStorageService.set('user.id', newUser.username);
        localStorageService.set('user.authToken', newUser.userToken);
        localStorageService.set('loginService', 'jwt');
        me.logged_in = true;

        me.registration.username = '';
        me.registration.password = '';

        $state.go('app.home');

      });

  };




  me.returnHome = function() {
    $state.go('app.login');
  }




}]);
