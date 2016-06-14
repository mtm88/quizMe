angular.module('pmApp.QuizQueCtrl', ['pmApp.quizQueDirective'])


  .controller('QuizQueController', ['$scope', '$timeout', 'localStorageService', 'QUIZQUE', '$state', '$compile',
    function ($scope, $timeout, localStorageService, QUIZQUE, $state, $compile) {

      this.quizMeStage = 'QuizME - lobby';

      function setLocalData() {
        var userDbId = localStorageService.get('userDbId');
        var username = localStorageService.get('username');

        var localData = {userDbId: userDbId, username: username};
        return localData
      }

      var localData = setLocalData();


      var socket = io.connect(QUIZQUE.url);

      $scope.$on('$destroy', function () {
        removeFromQue();
        socket.disconnect();
      });

      socket.on('connect_error', function (data) {
        console.log('connect error');
        console.log(data);
      });

      socket.on('connect', function () {
        console.log('user connected to QuizQue Socket');

      });

      socket.on(localData.userDbId + ' - opponent found', function () {
        $scope.$broadcast('opponent found');
      });

      socket.on(localData.userDbId + ' - quiz prepared', function () {
        $scope.$broadcast('quiz prepared');
      });


      socket.on(localData.username + ' - user added to que', function (response) {
        if (response.userAddedToQue == true) {
          $scope.$broadcast('user added to que');
        }
        else {
          throw('User not added to que, reason: ' + response);
        }
      });

      socket.on(localData.username + ' - user removed from que', function (response) {

        if (response.userRemovedFromQue == true) {
          console.log('userRemovedFromQue == true');
          setFieldBackToNormal();
        }

      });

      socket.on('quizDiscarded', function (response) {
        console.log(response);
        setFieldBackToNormal();
      });

      socket.on(localData.username + ' - opponent resigned', function (response) {
        console.log(response);
        $('#quizMeHeader').text('Opponent declined !');
        $('.opponentFoundDivs').hide(100);
        $('.opponentDeclined').show(400);

        $timeout(function () {
          setFieldBackToNormal();
          $('.opponentDeclined').hide();
          $('#quizMeHeader').text('Game Search in progress...');
        }, 2000);
      });


      socket.on(localData.username + ' - user accepted quiz', function () {

        $('.opponentFoundDivs').hide(100);
        $('.waitingForServer').show(400);

      });

      socket.on(localData.userDbId + ' - readyToLoadGame', function (info) {

        console.log(info);
        localStorageService.set('category', info.firstCategory);
        localStorageService.set('gameData', info.gameData);
        localStorageService.set('firstQuestionsData', info.questionsData);
        $state.go('app.quizGame');


      });

      this.acceptQuiz = function () {
        console.log('accept quiz');
        socket.emit('user accepted quiz', localData.username);
        $scope.$broadcast('user accepted quiz');
      };

      this.discardQuiz = function () {
        $('#discardQuiz').text('Discarding...');
        socket.emit('discardQuiz', localData.username);
      };


      this.startQuiz = function (difficulty) {
        this.quizMeStage = 'QuizME - Queing...';
        $scope.$apply();
        $scope.$broadcast('startQuiz');
        addToQue(difficulty);

      };

      this.stopQue = function () {
        $scope.$broadcast('back to menu');
        removeFromQue();
      };


      function addToQue(difficulty) {
        var dataForQue = {'username': localData.username, 'userDbId': localData.userDbId, 'difficulty': difficulty};
        socket.emit('addUsertoQue', dataForQue);
      }

      function removeFromQue() {
        var dataForQue = {'username': localData.username};
        socket.emit('removeUserFromQue', dataForQue);
      }

    }]);

