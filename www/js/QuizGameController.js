angular.module('pmApp.QuizGameCtrl', [])


.controller('QuizGameController', function($scope, localStorageService, $timeout, QUIZGAME, $interval, $state) {

      $('#rollingCard').hide();
      $('#progressbar').hide();
      $('#progressText').hide();
      $('#questionTimer').hide();
      $('#finalResultsDiv').hide();
      $('#chooseCategoryAfterLoss').hide();


      $('#listWithQuestions').hide();
      $('#myAnswersInfo').hide();
      $('#opponentAnswers').hide();
      $('#infoOnResults').hide();


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

        $('#quizMeRow').text('Category: ' + $scope.category);

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
            startAskingQuestions(0);
          }

        }, 1000);

      }


      socket.on(userDbId + ' - new questions data', function(questionsData, category) {

        //console.log('draw skoczony, mam dane nowej kategorii');

        $scope.category = category;
        usedCategories.push($scope.category);
        $('#categorySpinnerText').text('New category: ' + category);

        $timeout(function() {


          $('#opponentAnswers').hide(200);
          $('#myAnswersInfo').hide(200);
          $('#infoOnResults').hide(200);

        $scope.questions = questionsData;

          $scope.myAnswers = [];
          $scope.opponentAnswers = [];

        startTimer();


        }, 1500);

      });


      socket.on(userDbId + ' - opponent category results', function(opponentResult) {

          $('#infoOnResults').show(400);
          $('#opponentAnswersListSpinner').text('Opponent answers: ');
          $scope.opponentAnswers = opponentResult;
          $scope.$apply();

          //console.log('mam wszystkie odpowiedzi przeciwnika');
          //console.log(opponentResult);



          checkIfDraw();

          function checkIfDraw() {

            $('#infoOnResults').show(400);

            if(usedCategories.length == 3) {

                    $('#categorySpinnerText').text('Quiz Completed');

                    $timeout(function() {
                    
                      $('#rollingCard').hide();
                      $('#myAnswersInfo').hide();
                      $('#opponentAnswers').hide();
                      $('#infoOnNewCategory').hide();

                      socket.emit('get quiz results', $scope.quizGame_ctrl.gameData.quizID, userDbId);
                    }, 1500);

                  }

            else {

              var answersCountArray = decideWhoWon();

              var myCorrectAnswersCount = answersCountArray[0];
              var opponentCorrectAnswersCount = answersCountArray[1];

              if(myCorrectAnswersCount > opponentCorrectAnswersCount) {
                $('#infoOnNewCategory').text('You have won this category');
                $('#newCategorySpinner').show(400);
                $('#categorySpinnerText').text('Opponent choosing next category...');
              }

              else if(myCorrectAnswersCount < opponentCorrectAnswersCount) {
                $('#infoOnNewCategory').text('You have lost this category');
                $('#newCategorySpinner').hide(200);
                $('#chooseCategoryAfterLoss').show(400);
                $('#categoryChooserSpinnerText').text('Rolling categories...');

                socket.emit('bring categories to choose', usedCategories, $scope.quizGame_ctrl.gameData.quizID);

              }

              else {                        
                $('#infoOnNewCategory').text('We have a draw!');
                $('#categorySpinnerText').text('Rolling new category...');
                socket.emit('add me to draws', $scope.quizGame_ctrl.gameData.quizID, userDbId, usedCategories);             
              }

            }

        }

      });


    socket.on('prepared categories after loss', function(temporaryArrayOfCategories) {

      console.log(temporaryArrayOfCategories);
      $('#infoOnResults').hide(200);
      $('#categoryChooserSpinner').hide(200);
      $('#categoryChooserSpinnerText').text('Choose new category: ');

      $timeout(function() {
      $scope.categoriesToChoose = temporaryArrayOfCategories;
      })

    });


    $scope.chosenCategory = function(chosenCategory) {
      socket.emit('chosen category after loss', chosenCategory, $scope.quizGame_ctrl.gameData, $scope.categoriesToChoose);
      $('#chooseCategoryAfterLoss').hide(400);
      $scope.categoriesToChoose = '';
    }

    socket.on('final quiz results', function(quizAnswersArray) {

      var myPositionInArray = quizAnswersArray[0];
      var opponentPositionInArray = '';
      if(myPositionInArray == 1)
        opponentPositionInArray = 2;
      else
        opponentPositionInArray= 1;

      $timeout(function (){
      $scope.myAnswersResults = quizAnswersArray[myPositionInArray];
      $scope.opponentAnswerResults = quizAnswersArray[opponentPositionInArray];
     
      if($scope.myAnswersResults > $scope.opponentAnswerResults)
        $('#finalResultsInfoFrame').text('You have won the Quiz :-)');

      else if($scope.myAnswersResults < $scope.opponentAnswerResults)
        $('#finalResultsInfoFrame').text('You have lost the Quiz :-(');

      else
        $('#finalResultsInfoFrame').text('Quiz ended as a draw');

      $('#finalResultsDiv').show();

      });

    });


      function startAskingQuestions(i) {

 
        if(i > 0) $('#myAnswersInfo').show(400);

        if(i > 2) {


          //console.log(usedCategories);
          socket.emit('category results', userDbId, $scope.quizGame_ctrl.gameData, $scope.myAnswers, $scope.category);

          $('#listWithQuestions').hide();
          $('#questionTimer').hide();
          $('#myAnswersList').show(400);
          $('#opponentAnswers').show(200);
          return

        }

        var answers = [];

        answers.push({ 'answer' : $scope.questions[i].correctAnswer, 'correct' : true }, { 'answer' : $scope.questions[i].incorrectAnswer1, 'correct' : false },
         { 'answer' : $scope.questions[i].incorrectAnswer2, 'correct' : false });

        //console.log(answers);

        $scope.shuffledAnswers = shuffle(answers);

        //console.log($scope.shuffledAnswers);

        $timeout(function() {
        $scope.actualQuestion = $scope.questions[i].question;


       /* $scope.firstAnswer = $scope.shuffledAnswers[0];
        $scope.secondAnswer = $scope.shuffledAnswers[1];
        $scope.thirdAnswer = $scope.shuffledAnswers[2];
        $scope.fourthAnswer = $scope.shuffledAnswers[3];

        */

        $scope.questionTimer = 10;

        $scope.correctAnswer = $scope.questions[i].correctAnswer;
        $scope.actualQuestionNumber = i;

          $('#listWithQuestions').show(400);
          $('#questionTimer').show();
        });

        countTenSeconds(i);

      }

      this.userAnswer = function(userAnswer) {

        
        if(!$scope.clickedAnswer) {
        $scope.clickedAnswer = userAnswer;
    
        $interval.cancel($scope.countTenSecondsInterval);

        console.log($scope.correctAnswer);


        if(userAnswer == $scope.correctAnswer) {
          $scope.checkedAnswer = true;
        }

        else {
          $scope.checkedAnswer = false;
        }

        $timeout(function() {


        $scope.myAnswers.push({ 'question' : $scope.actualQuestionNumber+1, 'correctAnswer' : $scope.checkedAnswer });
        //console.log($scope.myAnswers);
        socket.emit('answer', $scope.checkedAnswer, $scope.category, username, $scope.quizGame_ctrl.gameData.quizID, $scope.actualQuestionNumber);

        $scope.checkedAnswer = '';
        $scope.clickedAnswer = '';
        $scope.actualQuestionNumber++;
        startAskingQuestions($scope.actualQuestionNumber);

      }, 800);

        }


      };

      this.backToBoard = function() {

        socket.emit('move quiz to archive', $scope.quizGame_ctrl.gameData.quizID);
        $state.go('app.quizQue');

      }


      function countTenSeconds(i) {

        $scope.countTenSecondsInterval = $interval(function() {
          $scope.questionTimer--;

          if($scope.questionTimer == 0) {
            $interval.cancel($scope.countTenSecondsInterval);
            $scope.myAnswers.push({ 'question' : i+1, 'correctAnswer' : false });
            //console.log($scope.myAnswers);
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

          if($scope.myAnswers[i].correctAnswer == true)
          myCorrectAnswers++;
          if($scope.opponentAnswers[i].correctAnswer == true)
          opponentCorrectAnswers++;

        }

        return [myCorrectAnswers, opponentCorrectAnswers];

      }





});

