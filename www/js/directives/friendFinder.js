angular.module('pmApp.friendFinderDirectives', [])

.directive('friendFinder', ['$http', 'SERVER', 'localStorageService', '$timeout', function($http, SERVER, localStorageService, $timeout) {

  return {

    require: 'ngModel',

    link : function(scope, element, attrs, ngModel) {

      var FBverified = false;

      var loginService = localStorageService.get('loginService');
      var token = localStorageService.get('user.authToken');


      if(loginService == 'fb')
        FBverified = true;



    ngModel.$setValidity('friendFinder', false);

    ngModel.$parsers.push(function(value) {

      var userDbId = localStorageService.get('userDbId'); // DOESNT WORK WHEN OUTSIDE OF PUSH, LEFT TO CHECK

      var searchedFriend = ngModel.$viewValue;
      
      scope.friendData = null;

      $timeout(function () {

        if(ngModel.$viewValue == searchedFriend) {
          searchDbForFriend();
        }

      }, 1000);

      scope.loadingData = true;

      function searchDbForFriend() {

      if(!value || value.length == 0) {
        scope.loadingData = false;
        return;
      }




          $http.post(SERVER.url + '/api/friendFinder', { friendUsername : value, token : token, userDbId : userDbId, FBverified : FBverified, loginService : loginService })
            .success( function(response) {

              scope.loadingData = false;

              if(response.friendExists == 'yes') {

                scope.friendData = { friendExists : true, friendDetails : response.friendInfo, alreadyFriend : false, requestAlreadySent : response.requestAlreadySent };

                // console.log(scope.$parent.home_ctrl.friendList);

                // CHECK IF THE SEARCHED FRIEND IS ALREADY ON THE FRIEND LIST

                  for(i = 0; i < scope.$parent.home_ctrl.friendList.length; i++) {
                    if(scope.$parent.home_ctrl.friendList[i].userDbId == response.friendInfo._id) {
                      scope.friendData = { friendExists : true, friendDetails : response.friendInfo, alreadyFriend : true, requestAlreadySent : response.requestAlreadySent };
                      console.log('juz przyjaciel');
                    }
                  }
                console.log(scope.friendData);


              }

              else {
                scope.friendData = { friendExists : false, alreadyFriend : false };
              }


            })
            .error(function(error) {
              console.log(error);
            });

      }

      return value

    })

    }

  }


}]);
