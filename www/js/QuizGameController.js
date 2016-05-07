angular.module('pmApp.QuizGameCtrl', [])


.controller('QuizGameController', ['$scope', 'localStorageService', '$timeout', 'QUIZGAME', '$interval',
    function($scope, localStorageService, $timeout, QUIZGAME, $interval) {

      $('#rollingCard').hide();
      $('#progressbar').hide();
      $('#progressText').hide();

      var firstCategory = localStorageService.get('firstCategory');
      $scope.quizGame_ctrl.gameData = localStorageService.get('gameData');

      $scope.$on('$destroy', function() {
        console.log('scope destroy');
        socket.disconnect();
      });

      $scope.$on('$ionicView.enter', function() {

        $timeout(function() {
          $('#rollingCard').show(400);

          $timeout(function() {
            $('#quizMeHeaderSpinner').hide();
            $('#quizMeRow').text('Rolled category: ' + firstCategory);
            startTimer();
          }, 2000);

        }, 1000)
      });


      var socket = io.connect(QUIZGAME.url);

      socket.on('connect_error', function(data) {
        console.log('connect error');
        console.log(data);
      });



      function startTimer() {

        var changeValue = '';

        var progressBar = $('#progressbar');
        $scope.quizGame_ctrl.actualValue = $('#progressbar').attr('value');

        changeValue = progressBar.val($scope.quizGame_ctrl.actualValue--);

        $('#progressbar').show(400);
        $('#progressText').show(400);

        var progressBarAnimate = $interval(function() {

          $scope.quizGame_ctrl.actualValue--;

          changeValue = progressBar.val($scope.quizGame_ctrl.actualValue);

          if($scope.quizGame_ctrl.actualValue == 0) {
            $interval.cancel(progressBarAnimate);
            $('#colWithSpinner').hide();
            $('#progressText').hide();
            $('#playersDiv').hide();
            $('#difficultyDiv').hide();
            $('#quizMeRow').text('Category: ' + firstCategory);
          }

        }, 1000);


      }





}]);

