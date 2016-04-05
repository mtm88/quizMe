angular.module('pmApp.registerFormDirectives', [])

.directive('userAvailabilityValidator', ['$http', 'SERVER', function($http, SERVER) {

  return {

    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {

      function setAsLoading(bool) {
        ngModel.$setValidity('recordLoading', !bool);
      }

      function setAsAvailable(bool) {
        ngModel.$setValidity('recordAvailable', bool);
      }

      ngModel.$parsers.push(function(value) {
        if(!value || value.length == 0) return;

        setAsLoading(true);
        setAsAvailable(true);

        $http.post(SERVER.url + '/api/checkUsernameAvailability', { username : value })
          .success(function(userInfo) {

            if(userInfo.exists == false) {
            setAsLoading(false);
            setAsAvailable(true);
            }

            else if(userInfo.exists == true) {
              setAsLoading(false);
              setAsAvailable(false);
            }

          })
          .error(function() {
            console.log('Could\'nt connect to server');
            setAsLoading(false);
            setAsAvailable(false);
          });

        return value

      })

    }


  }

}])

.directive('passwordValidation', function() {

  return {

    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {

      function checkIfMatch(bool) {
        ngModel.$setValidity('checkIfMatch', bool);
      }


      ngModel.$parsers.push(function(value) {
          if(scope.registerForm.password.$viewValue == value && scope.registerForm.password.$valid == true) {
            checkIfMatch(true);
          }

          else {
            checkIfMatch(false);
          }

        return value

      });



    }


  }

})

.directive('clearRePassword', function() {

  return {

    require : 'ngModel',
    link : function(scope, element, attrs, ngModel) {

      ngModel.$parsers.push(function(value) {

        scope.registerForm.RePassword.$setViewValue(null);
        scope.registerForm.RePassword.$render();

        return value

      })

    }
  }
});
