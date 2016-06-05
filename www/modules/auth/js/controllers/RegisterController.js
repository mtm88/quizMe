angular.module('pmApp.RegisterCtrl', [])

.controller('RegisterController', function($state, postData, localStorageService, friendList) {


 var me = this;

  me.register = function() {

    postData.registerUser({ username : me.username, password : me.password })
      .then( function(newUser) {

       console.log(newUser);

        localStorageService.set('user.id', newUser.username);
        localStorageService.set('userDbId', newUser.userDbId);
        localStorageService.set('user.authToken', newUser.userToken);
        localStorageService.set('loginService', 'jwt');
        me.logged_in = true;

        me.username = '';
        me.password = '';

        friendList.setOnlineStatus(newUser.userDbId, newUser.token, true);

        $state.go('app.home');

      });

  };




  me.returnHome = function() {
    $state.go('app.login');
  }




});
