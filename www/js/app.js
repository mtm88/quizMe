angular.module('pmApp', ['ionic', 'ngMessages', 'LocalStorageModule', 'pmApp.LoginCtrl', 'pmApp.RegisterCtrl', 'pmApp.HomeCtrl', 'pmApp.FriendCtrl', 'pmApp.ChatCtrl',
  'pmApp.postDataServices', 'pmApp.loginOriginService', 'pmApp.registerFormDirectives', 'pmApp.checkUsernameAvailability', 'pmApp.friendList', 'pmApp.friendFinderDirectives'])

  .constant('SERVER', {

    url: 'http://192.168.0.2:5000'

  //url: 'http://mtm88-pmserver.herokuapp.com',
   // port: 13530

  })

.run(function($ionicPlatform, friendList, localStorageService, $rootScope) {



   /* $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
   console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
   });
   $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
   $rootScope.$on("$stateChangeError", console.log.bind(console));
   });
   $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
   console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
   });
   // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
   //   // runs on individual scopes, so putting it in "run" doesn't work.
   //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
   // });
   $rootScope.$on('$viewContentLoaded', function (event) {
   console.log('$viewContentLoaded - fired after dom rendered', event);
   });
   $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
   console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
   console.log(unfoundState, fromState, fromParams);
   }); */



  var token = localStorageService.get('user.authToken');

  $ionicPlatform.on('resume', function() {
    if(token) {
      var userDbId = localStorageService.get('userDbId');
      friendList.setOnlineStatus(userDbId, token, true);
      console.log("wrocilem z backgroundu");
    }
  });

  $ionicPlatform.on('pause', function() {
    if(token) {
      var userDbId = localStorageService.get('userDbId');
      friendList.setOnlineStatus(userDbId, token, false);
      console.log("wychodze do backgroundu");
    }
  });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

    // CENTRUJE TYTUL NAGLOWKA
.config(function( $ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

      .state('app.login', {
        url: '/login',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: '../modules/auth/templates/login.html'
          }
        }
      })

    .state('app.register', {
      url: 'register',
      views: {
        'menuContent': {
          templateUrl: '../modules/auth/templates/register.html'
        }
      }
    })

      .state('app.home', {
          url: '/home',
          cache: false,
          views: {
              'menuContent': {
                  templateUrl: 'templates/home.html'
              }
          }
      })

      .state('app.friends', {
        url: '/friends',
        abstract: true,
        parent: 'app',
        views: {
          'menuContent': {
          templateUrl: '../modules/friendList/templates/friends.html'
        }
      }
      })

  .state('app.friends.list', {
    url: '/list',
    cache: false,
    views: {
      'friendlistContent': {
        templateUrl: '../modules//friendList/templates/list.html'
      }
    }
  })

  .state('app.friends.requests', {
    url: '/requests',
    cache: false,
    views: {
      'requestsContent': {
        templateUrl: '../modules/friendList/templates/requests.html'
      }
    }
  })

  .state('app.friends.search', {
    url: '/search',
    views: {
      'searchContent': {
        templateUrl: '../modules/friendList/templates/search.html'
      }
    }
  })

    .state('app.chat', {
      url: '/chat',
      cache: false,
      views : {
        'menuContent': {
          templateUrl: 'templates/chat.html'
        }
      }


    })


    $urlRouterProvider.otherwise('/app/login');

});
