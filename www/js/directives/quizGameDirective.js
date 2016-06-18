angular.module('pmApp')


  .directive('quizGameDirective', function () {

    return {

      restrict: 'E',
      replace: 'true',
      template: '<div id="quizGameArea"></div>',
      link: function (scope, elem, attr) {


        function randomRating () {
         var randomNumber = Math.floor((Math.random() * 1000) + 1);
          return randomNumber
        }

        var quizGameMainInfo = $('<div class="item item-divider"><div class="col text-center" id="gameStatusText">Both players are ready!</div></div>').hide();

        console.log(scope.quizGame_ctrl.gameData.players[0].difficulty);

        var playersInfo = $(
          '<div id="playersDiv" class="list card">' +
          '<div class="item item-avatar">' +
          '<img src="">' +
          '<h2>' + scope.quizGame_ctrl.gameData.players[0].username + '</h2>' +
          '<p>Personal Rating: ' + randomRating() + '</p>' +
          '</div>' +
          '</div>' +

          '<div id="playersDiv" class="list card">' +
          '<div class="item item-avatar">' +
          '<img src="">' +
          '<h2>' + scope.quizGame_ctrl.gameData.players[1].username + '</h2>' +
          '<p>Personal Rating: ' + randomRating() + '</p>' +
          '</div>' +
          '</div>' +

          '<div class="item item-divider" id="difficultyDiv">' +
          'Difficulty: ' +
          '</div>' +


          '<div class="row text-center" id="dificultyRow">' +
          '<div class="col" id="regular">Regular</div>' +
          '<div class="col" id="ranked">Ranked</div>' +
          '<div class="col" id="solo">Solo</div>' +

          '</div>').hide();



        $('#quizGameArea').append(quizGameMainInfo);
        $('#quizGameArea').append(playersInfo);
        quizGameMainInfo.show();
        playersInfo.show();

        $('#' + scope.quizGame_ctrl.gameData.players[0].difficulty).addClass('button button-small button-assertive');

      }
    }
  });
