angular.module('pmApp.QuizCtrl', [])


.controller('QuizController', ['$scope', '$timeout', 'localStorageService', 'QUIZQUE',
    function($scope, $timeout, localStorageService, QUIZQUE) {


    $('#quizSearcher').hide();
    $('#addedToQueMark').hide();
    $('#lookingForOpponent').hide();
    $('#opponentFound').hide();
    $('.opponentFoundDivs').hide();
    $('#preparingQuiz').hide();
    $('#quizPrepared').hide();
    $('.opponentDeclined').hide();
    $('.waitingForOpponent').hide();
    $('.bothPlayersReady').hide();


      function setLocalData() {
        var userDbId = localStorageService.get('userDbId');
        var username = localStorageService.get('username');

        var localData = { userDbId : userDbId, username : username };
        return localData
      }

      var localData = setLocalData();


      var socket = io.connect(QUIZQUE.url);

      $scope.$on('$destroy', function() {
        console.log('scope destroy');
        removeFromQue();
        socket.disconnect();
      });

      socket.on('connect_error', function(data) {
        console.log('connect error');
        console.log(data);
      });

      socket.on('connect', function() {
        console.log('user connected to QuizQue Socket');

      });

      socket.on(localData.userDbId + ' - opponent found', function(playersInfo) {
        console.log(playersInfo);

        $('#lookingForOpponent').hide(100);
        $('#cancelSearch').hide(100);
        $('#opponentFound').show(400);
        $('#preparingQuiz').show(800);


      });

      socket.on(localData.userDbId + ' - quiz prepared', function(playersInfo) {
        console.log(playersInfo);

        $('#preparingQuiz').hide(100);
        $('#quizPrepared').show(400);
        $('.opponentFoundDivs').show(800);

      });


      socket.on(localData.username + ' - user added to que', function(response) {

        if(response.userAddedToQue == true) {
          $('#addedToQueMark').show(400);

          $timeout(function () {

            $('#lookingForOpponent').show(400);

          }, 1000);

          console.log('userADdedToQue == true');
        }

      });

      socket.on(localData.username + ' - user removed from que', function(response) {

        if(response.userRemovedFromQue == true) {
          console.log('userRemovedFromQue == true');
          setFieldBackToNormal();
        }

      });

      socket.on('quizDiscarded', function(response) {
        console.log(response);
        setFieldBackToNormal();
      });

      socket.on(localData.username + ' - opponent resigned', function(response) {
        console.log(response);
        $('#quizMeHeader').text('Opponent declined !');
        $('.opponentFoundDivs').hide(100);
        $('.opponentDeclined').show(400);

        $timeout(function() {
          setFieldBackToNormal();
        }, 2000);
      });


      socket.on(localData.username + ' - opponent not yet accepted quiz', function() {
        console.log('1');

        $('.opponentFoundDivs').hide(100);
        $('.waitingForOpponent').show(400);

      });

      socket.on(localData.username + ' - opponent accepted quiz', function() {
        console.log('2');
        $('.opponentFoundDivs').hide(100);
        $('.bothPlayersReady').show(400);

      });





      // to not repeat myself
      function setFieldBackToNormal() {
        $('#quizSearcher').hide(100);
        $('#lookingForOpponent').hide(100);
        $('#addedToQueMark').hide(100);
        $('#opponentFound').hide(100);
        $('#quizChooser').show(400);
        $('#discardQuiz').text('Cancel');
      }



      this.acceptQuiz = function() {
        socket.emit('user accepted quiz', localData.username);
        $('.opponentFoundDivs').hide(100);
      };

      this.discardQuiz = function() {
        $('#discardQuiz').text('Discarding...');
        socket.emit('discardQuiz', localData.username);
      };




    this.startQuiz = function(difficulty) {

      $('#quizChooser').hide(100);
      $('#quizSearcher').show(400);

        addToQue(difficulty);

    };

    this.stopQue = function() {
      removeFromQue();
    };




      function addToQue(difficulty) {
        var dataForQue = { 'username' : localData.username, 'userDbId' : localData.userDbId, 'difficulty' : difficulty };
        socket.emit('addUsertoQue', dataForQue);
      }

      function removeFromQue() {
          var dataForQue = { 'username' : localData.username };
          socket.emit('removeUserFromQue', dataForQue);
      }





}]);

