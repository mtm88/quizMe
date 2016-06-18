angular.module('pmApp')


  .directive('quizGameDirective', function ($timeout) {

    return {

      restrict: 'E',
      replace: 'true',
      template: '<div id="quizGameArea"></div>',
      link: function (scope, elem, attr) {

        //temporary until ranking will be implemented
        function randomRating() {
          return Math.floor((Math.random() * 1000) + 1);
        }

        var quizGameSpinnerObject = $('<div class="item item-divider" id="spinnerDivider">' +
          '<div class="row" id="spinnerDividerRow">' +
          '<div class="col col-10">' +
          '<div class="cssload-container"><div class="cssload-whirlpool"></div></div>' +
          '</div>' +
          '<div class="col spinnerText" id="gameStatusText">Rolling category for first round...</div>' +
          '</div>' +
          '</div>').hide();

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


          '<div class="row text-center" id="difficultyRow">' +
          '<div class="col button button-small" id="regular">Regular</div>' +
          '<div class="col button button-small" id="ranked">Ranked</div>' +
          '<div class="col button button-small" id="solo">Solo</div>' +

          '</div>').hide();

        $('#quizGameArea').append(quizGameMainInfo);
        $('#quizGameArea').append(playersInfo);
        quizGameMainInfo.show();
        playersInfo.show();

        $('#' + scope.quizGame_ctrl.gameData.players[0].difficulty).addClass('button button-small button-balanced');

        $timeout(function () {
          $('#quizGameArea').append(quizGameSpinnerObject);
          quizGameSpinnerObject.fadeIn('slow');

          $timeout(function () {
            $('#spinnerDividerRow').fadeOut('fast');
            $('#spinnerDivider').prepend('<div class="row" id="catFound">' +
              '<div class="col col-10"><i class="icon ion-checkmark-round markIcon markGreen"></i></div>' +
              '<div class="col doneText">Done!</div>' +
              '</div>')
              .hide().fadeIn('slow');

            $timeout(function () {
              $('#catFound').hide();

              $('#catFound > .col-10 > i').removeClass('ion-checkmark-round markGreen').addClass('ion-university markBlue');
              $('#catFound > .doneText').text('Rolled category: ').css('font-size', '15px');
              $('#catFound').append('<div class="col">' + scope.category + '</div>');

              $('#catFound').show();

            }, 1500);

          }, 2000);

        }, 2000);

      }
    }
  });
