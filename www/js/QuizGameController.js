angular.module('pmApp.QuizGameCtrl', [])


.controller('QuizGameController', function($scope, localStorageService, $timeout, QUIZGAME, $interval) {

      $('#rollingCard').hide();
      $('#progressbar').hide();
      $('#progressText').hide();
      $('#questionTimer').hide();

     //$('#myAnswersList').hide();


      $('#listWithQuestions').hide();
      $('#opponentAnswers').hide();
      $('#opponentChoosingNewCategory').hide();


      $scope.myAnswers = [];

      $scope.category = localStorageService.get('category');
      $scope.questions = localStorageService.get('firstQuestionsData');

      var username = localStorageService.get('username');
      var userDbId = localStorageService.get('userDbId');

      $scope.quizGame_ctrl.gameData = localStorageService.get('gameData');

      var usedCategories = [];
      usedCategories.push($scope.category);


      $scope.$on('$destroy', function() {
        socket.disconnect();
      });

      $scope.$on('$ionicView.enter', function() {

        $timeout(function() {
          $('#rollingCard').show(400);

          $timeout(function() {
            $('#quizMeHeaderSpinner').hide();
            $('#quizMeRow').text('Rolled category: ' + $scope.category);
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
        $scope.quizGame_ctrl.actualValue = $('#progressbar').attr('max');

        changeValue = progressBar.val($scope.quizGame_ctrl.actualValue--);

        $('#progressbar').show(400);
        $('#progressText').show(400);

        var progressBarAnimate = $interval(function() {

          $scope.quizGame_ctrl.actualValue--;

          changeValue = progressBar.val($scope.quizGame_ctrl.actualValue);

          if($scope.quizGame_ctrl.actualValue == 0) {
            $interval.cancel(progressBarAnimate);
            $('#colWithSpinner').hide(200);
            $('#progressText').hide(200);
            $('#playersDiv').hide(200);
            $('#difficultyDiv').hide(200);
            $('#quizMeRow').text('Category: ' + $scope.category);
            startAskingQuestions(0);
          }

        }, 1000);

      }


      socket.on(userDbId + ' - new questions data', function(questionsData, category) {

        console.log('draw skoczony, mam dane nowej kategorii');

        $scope.category = category;
        usedCategories.push($scope.category);
        $('#categorySpinnerText').text('New category: ' + category);

        $timeout(function() {
        $scope.questions = questionsData;

          $scope.myAnswers = [];
          $scope.opponentAnswers = [];

        startTimer();


        }, 1500);

      });


      socket.on(userDbId + ' - opponent category results', function(opponentResult) {

        $('#opponentAnswersListSpinner').text('Opponent answers: ');
        $scope.opponentAnswers = opponentResult;
        $scope.$apply();

        if(opponentResult.length == 3) {
          $interval.cancel($scope.opponentAnswersInterval);
          console.log('mam wszystkie odpowiedzi przeciwnika, anuluje interval');
          console.log(opponentResult);

          checkIfDraw();

        }


        function checkIfDraw() {

              var answersCountArray = decideWhoWon();

              var myCorrectAnswersCount = answersCountArray[0];
              var opponentCorrectAnswersCount = answersCountArray[1];

              if(myCorrectAnswersCount > opponentCorrectAnswersCount) {
                $('#infoOnNewCategory').text('You have won this category');
                $('#spinnerText').text('Opponent choosing next category...');
              }

              else if(myCorrectAnswersCount < opponentCorrectAnswersCount) {
                $('#infoOnNewCategory').text('You have lost this category');
                $('#newCategorySpinner').hide(200);
              }

              else {
                $('#infoOnNewCategory').text('We have a draw!');
                $('#categorySpinnerText').text('Rolling new category...');
                socket.emit('add me to draws', $scope.quizGame_ctrl.gameData.quizID, userDbId, usedCategories);
              }

        }

      });


      function startAskingQuestions(i) {

        if(i == 1) $('#quizMeRow').text('Your answers: ' );

        if(i > 2) {

          $scope.opponentAnswersInterval = $interval(function() {
            console.log(usedCategories);
            console.log('Interval for opponent category results running...');
          socket.emit('category results', userDbId, $scope.quizGame_ctrl.gameData, $scope.myAnswers, $scope.category);
          }, 2000);

          $('#listWithQuestions').hide();
          $('#questionTimer').hide();
          $('#myAnswersList').show(400);
          $('#opponentAnswers').show(200);
          return

        }

        var answers = [];

        answers.push($scope.questions[i].correctAnswer ,$scope.questions[i].incorrectAnswer1, $scope.questions[i].incorrectAnswer2, $scope.questions[i].incorrectAnswer3);

        //console.log(answers);

        var shuffledAnswers = shuffle(answers);

        //console.log(shuffledAnswers);


        $timeout(function() {
        $scope.actualQuestion = $scope.questions[i].question;
        $scope.firstAnswer = shuffledAnswers[0];
        $scope.secondAnswer = shuffledAnswers[1];
        $scope.thirdAnswer = shuffledAnswers[2];
        $scope.thirdAnswer = shuffledAnswers[3];
        $scope.questionTimer = 2;

          $('#listWithQuestions').show(400);
          $('#questionTimer').show();
        });

        countTenSeconds(i);

      }



      function countTenSeconds(i) {

        var countTenSecondsInterval = $interval(function() {
          $scope.questionTimer--;

          if($scope.questionTimer == 0) {
            $interval.cancel(countTenSecondsInterval);
            $scope.myAnswers.push({ 'question' : i+1, 'correctAnswer' : 'false' });
            console.log($scope.myAnswers);
            socket.emit('answer', false, $scope.category, username, $scope.quizGame_ctrl.gameData.quizID, i);

            i++;
            startAskingQuestions(i);
          }
        }, 1000)
      }



      function shuffle(array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);

          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }

        return array;
      }


      function decideWhoWon() {

        var myCorrectAnswers = 0;
        var opponentCorrectAnswers = 0;

        for( i = 0 ; i < $scope.myAnswers.length ; i++ ) {

          if($scope.myAnswers[i].correctAnswer == 'true')
          myCorrectAnswers++;
          if($scope.opponentAnswers[i].correctAnswer == 'true')
          opponentCorrectAnswers++;

        }

        return [myCorrectAnswers, opponentCorrectAnswers];

      }





});

