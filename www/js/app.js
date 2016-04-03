angular.module('pmApp', ['ionic', 'ngMessages', 'LocalStorageModule', 'pmApp.LoginCtrl', 'pmApp.RegisterCtrl', 'pmApp.HomeCtrl',
  'pmApp.postDataServices', 'pmApp.loginOriginService', 'pmApp.registerFormDirectives', 'pmApp.checkUsernameAvailability'])

  .constant('SERVER', {

  //  url: 'http://192.168.0.2:5000'

  url: 'http://mtm88-pmserver.herokuapp.com',
    port: 13530

  })

.run(function($ionicPlatform) {
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
            templateUrl: 'templates/login.html'
          }
        }
      })

    .state('app.register', {
      url: 'register',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html'
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
      });



    $urlRouterProvider.otherwise('/app/login');

});
