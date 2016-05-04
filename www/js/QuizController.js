angular.module('pmApp.QuizCtrl', [])


.controller('QuizController', ['$scope', '$timeout', 'localStorageService', 'QUIZQUE',
    function($Scope, $timeout, localStorageService, QUIZQUE) {


    $('#quizSearcher').hide();
    $('#addedToQueMark').hide();
    $('#lookingForOpponent').hide();
    $('#opponentFound').hide();

      function setLocalData() {
        var userDbId = localStorageService.get('userDbId');
        var username = localStorageService.get('username');

        var localData = { userDbId : userDbId, username : username };
        return localData
      }

      var localData = setLocalData();


      var socket = io.connect(QUIZQUE.url);

      socket.on('connect_error', function(data) {
        console.log('connect error');
        console.log(data);
      });

      socket.on('connect', function() {
        console.log('user connected to QuizQue Socket');

      });

      socket.on(localData.userDbId + ' - opponent found', function(playersInfo) {
        console.log(playersInfo);
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
          $('#quizSearcher').hide(100);
          $('#lookingForOpponent').hide(100);
          $('#addedToQueMark').hide(100);
          $('#opponentFound').hide(100);
          $('#quizChooser').show(400);
        }

      });



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

