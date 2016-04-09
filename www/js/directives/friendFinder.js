angular.module('pmApp.friendFinderDirectives', [])

.directive('friendFinder', ['$http', 'SERVER', 'localStorageService', '$timeout', function($http, SERVER, localStorageService, $timeout) {

  return {

    require: 'ngModel',

    link : function(scope, element, attrs, ngModel) {


    ngModel.$parsers.push(function(value) {

      scope.friendData = null;

      if(!value || value.length == 0) return;

      var FBverified = false;

      var loginService = localStorageService.get('loginService');
      var token = localStorageService.get('user.authToken');


      if(loginService == 'fb')
        FBverified = true;


      $http.post(SERVER.url + '/api/friendFinder', { friendUsername : value, token : token, FBverified : FBverified })
        .success( function(response) {

          if(response.friendExists == 'yes') {
            scope.friendData = response.friendInfo;
            console.log(scope.friendData);
            console.log(scope);
          }

        })
        .error(function(error) {
          console.log(error);
        });




      return value

    })



    }


  }






}]);
