angular.module('pmApp.QuizGameCtrl', [])


.controller('QuizGameController', function($scope, localStorageService, $timeout, QUIZGAME, $interval) {

      $('#rollingCard').hide();
      $('#progressbar').hide();
      $('#progressText').hide();
      $('#questionTimer').hide();

     //$('#myAnswersList').hide();


      $('#listWithQuestions').hide();
      $('#opponentAnswers').hide();
      $('#opponentAnswersListSpinner').hide();
      $('#opponentAnswersList').hide();
      $('#opponentChoosingNewCategory').hide();




      var category = localStorageService.get('firstCategory');
      var questions = localStorageService.get('questions');

      var username = localStorageService.get('username');
      var userDbId = localStorageService.get('userDbId');

      $scope.quizGame_ctrl.gameData = localStorageService.get('gameData');

      var usedCategories = [];
      usedCategories.push(category);


      $scope.$on('$destroy', function() {
        socket.disconnect();
      });

      $scope.$on('$ionicView.enter', function() {

        $timeout(function() {
          $('#rollingCard').show(400);

          $timeout(function() {
            $('#quizMeHeaderSpinner').hide();
            $('#quizMeRow').text('Rolled category: ' + category);
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
            $('#colWithSpinner').hide(200);
            $('#progressText').hide(200);
            $('#playersDiv').hide(200);
            $('#difficultyDiv').hide(200);
            $('#quizMeRow').text('Category: ' + category);
            getQuestions(category, questions);
          }

        }, 1000);

      }


      function getQuestions(category) {
        socket.emit('get first questions', { 'category' : category, 'questions' : questions });
      }

      socket.on('first questions data', function(questionsData) {
        localStorageService.set('firstCategory', '');
        $scope.questions = questionsData;
        $scope.myAnswers = [];
        startAskingQuestions(0);
      });


      socket.on(userDbId + ' - opponent category results', function(opponentResult) {

        $('#opponentAnswersListSpinner').text('Opponent results: ');
        $('#opponentAnswersList').show(1000);

        $scope.opponentAnswers = opponentResult;


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
            $('#spinnerText').text('Rolling new category...');
            socket.emit('add me to draws', $scope.quizGame_ctrl.gameData.quizID, userDbId, usedCategories);
          }

      });

    socket.on(userDbId + ' - rolled category from draw', function(rolledCategory) {
      console.log(rolledCategory);
    });



      function startAskingQuestions(i) {

        if(i == 1) $('#quizMeRow').text('Your answers: ' );

        if(i > 2) {

          var opponentNumberInArray = '';

          if($scope.quizGame_ctrl.gameData.players[0].username == username)
            opponentNumberInArray = 1;
          else
            opponentNumberInArray = 0;

          socket.emit('category results', username, $scope.quizGame_ctrl.gameData.players[opponentNumberInArray], $scope.myAnswers);

          $('#listWithQuestions').hide();
          $('#questionTimer').hide();
          $('#myAnswersList').show(400);
          $('#opponentAnswers').show(200);
          $('#opponentAnswersListSpinner').show(400);
          return

        }

        var answers = [];


        answers.push($scope.questions[i].correctAnswer ,$scope.questions[i].incorrectAnswer1, $scope.questions[i].incorrectAnswer2, $scope.questions[i].incorrectAnswer3);

        console.log(answers);

        var shuffledAnswers = shuffle(answers);

        console.log(shuffledAnswers);


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
            socket.emit('answer', false, category, username, $scope.quizGame_ctrl.gameData.quizID, i);

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

        var correctAnswers = '';
        var opponentCorrectAnswers = '';

        for( i = 0 ; i < $scope.myAnswers.length ; i++ ) {

          if($scope.myAnswers[i].correctAnswer == 'true')
          correctAnswers++;

          if($scope.opponentAnswers[i].correctAnswer == 'true') {
          opponentCorrectAnswers++;
          }

        }

        return [correctAnswers, opponentCorrectAnswers];

      }





});

