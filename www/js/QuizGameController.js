(function () {
  angular.module('pmApp.QuizGameCtrl', [])

    .controller('QuizGameController', quizGameController);

  quizGameController.$inject = ['$scope', 'localStorageService', '$timeout', 'QUIZGAME', '$interval', '$state', '$ionicLoading'];

  function quizGameController($scope, localStorageService, $timeout, QUIZGAME, $interval, $state, $ionicLoading) {

    this.quizMeStage = 'QuizME';

    $scope.myAnswers = [];

    $scope.category = localStorageService.get('category');
    $scope.questions = localStorageService.get('firstQuestionsData');

    console.log($scope.questions);
    console.log($scope.category);

    var username = localStorageService.get('username');
    var userDbId = localStorageService.get('userDbId');

    $scope.quizGame_ctrl.gameData = localStorageService.get('gameData');

    $scope.usedCategories = [];
    $scope.usedCategories.push($scope.category);


    $scope.$on('$destroy', function () {
      socket.disconnect();
    });

    $scope.$on('$ionicView.enter', function () {
      //cleared after refactor, up for removal
    });

    $scope.$on('start asking questions', function (event, i) {
      startAskingQuestions(i);
    });

    $scope.$on('add answer', function (event, data) {
      socket.emit('answer', data.valid, $scope.category, username, $scope.quizGame_ctrl.gameData.quizID, data.i);
    });

    $scope.$on('category results from directive', function () {
      socket.emit('category results', userDbId, $scope.quizGame_ctrl.gameData, $scope.myAnswers, $scope.category);
    });

    $scope.$on('directive requests for draw', function () {
      socket.emit('add me to draws', $scope.quizGame_ctrl.gameData.quizID, userDbId, $scope.usedCategories);
    });


    var socket = io.connect(QUIZGAME.url);

    socket.on('connect_error', function (ErrData) {
      console.log('connect error');
      console.log(ErrData);
    });


    socket.on(userDbId + ' - new questions data', function (questionsData, category) {
      $scope.$broadcast('new questions data from controller', {questions: questionsData, category: category});
    });


    socket.on(userDbId + ' - opponent category results', function (opponentResult) {
      console.log('opponent results received, broadcasting');
      $scope.$broadcast('opponent category results', opponentResult);
    });


    socket.on('prepared categories after loss', function (temporaryArrayOfCategories) {

      //console.log(temporaryArrayOfCategories);
      $('#infoOnResults').hide(200);
      $('#categoryChooserSpinner').hide(200);
      $('#categoryChooserSpinnerText').text('Choose new category: ');

      $timeout(function () {
        $scope.categoriesToChoose = temporaryArrayOfCategories;
      })

    });


    $scope.chosenCategory = function (chosenCategory) {
      socket.emit('chosen category after loss', chosenCategory, $scope.quizGame_ctrl.gameData, $scope.categoriesToChoose);
      $('#chooseCategoryAfterLoss').hide(400);
      $scope.categoriesToChoose = '';
      $scope.loadingNewCategory = true;
    };

    socket.on('final quiz results', function (quizAnswersArray) {

      var myPositionInArray = quizAnswersArray[0];
      var opponentPositionInArray = '';
      if (myPositionInArray == 1)
        opponentPositionInArray = 2;
      else
        opponentPositionInArray = 1;

      $ionicLoading.hide();

      $timeout(function () {
        $scope.myAnswersResults = quizAnswersArray[myPositionInArray];
        $scope.opponentAnswerResults = quizAnswersArray[opponentPositionInArray];

        if ($scope.myAnswersResults > $scope.opponentAnswerResults)
          $('#finalResultsInfoFrame').text('You have won the Quiz :-)');

        else if ($scope.myAnswersResults < $scope.opponentAnswerResults)
          $('#finalResultsInfoFrame').text('You have lost the Quiz :-(');

        else
          $('#finalResultsInfoFrame').text('Quiz ended as a draw');

        $('#finalResultsDiv').show();

      });

    });


    function startAskingQuestions(i) {

      if (i > 0) $('#myAnswersInfo').show(400);

      var answers = [];

      answers.push({
          'answer': $scope.questions[i].correctAnswer,
          'correct': true
        },
        {'answer': $scope.questions[i].incorrectAnswer1, 'correct': false},
        {'answer': $scope.questions[i].incorrectAnswer2, 'correct': false});

      $scope.shuffledAnswers = shuffle(answers);

      $timeout(function () {
        $scope.actualQuestion = $scope.questions[i].question;
        $scope.correctAnswer = $scope.questions[i].correctAnswer;
        $scope.actualQuestionNumber = i;
        $scope.$broadcast('show questions', i);
      });

    }

    this.userAnswer = function (userAnswer) {

      $timeout(function () {
        $scope.clickedAnswer = userAnswer;
      });

      $interval.cancel($scope.countTenSecondsInterval);

      console.log($scope.correctAnswer);

      $scope.checkedAnswer = false;
      if (userAnswer == $scope.correctAnswer) {
        $scope.checkedAnswer = true;
      }

      $timeout(function () {
        $scope.showCorrectAnswer = true;
      }, 300);

      $timeout(function () {
        $scope.myAnswers.push({'question': $scope.actualQuestionNumber + 1, 'correctAnswer': $scope.checkedAnswer});
        //console.log($scope.myAnswers);
        socket.emit('answer', $scope.checkedAnswer, $scope.category, username, $scope.quizGame_ctrl.gameData.quizID, $scope.actualQuestionNumber);

        $scope.checkedAnswer = undefined;
        $scope.clickedAnswer = undefined;
        $scope.showCorrectAnswer = undefined;
        $scope.actualQuestionNumber++;
        startAskingQuestions($scope.actualQuestionNumber);
      }, 1000);
    };

    this.backToBoard = function () {
      socket.emit('move quiz to archive', $scope.quizGame_ctrl.gameData.quizID);
      $state.go('app.quizQue');
    };


    /* function countTenSeconds(i) {

     $scope.countTenSecondsInterval = $interval(function () {
     $scope.questionTimer--;

     if ($scope.questionTimer == 0) {
     $interval.cancel($scope.countTenSecondsInterval);
     $scope.myAnswers.push({'question': i + 1, 'correctAnswer': false});
     //console.log($scope.myAnswers);
     socket.emit('answer', false, $scope.category, username, $scope.quizGame_ctrl.gameData.quizID, i);

     i++;
     startAskingQuestions(i);
     }
     }, 1000)
     } */


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


  }

})();
