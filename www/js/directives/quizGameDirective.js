(function () {

angular.module('pmApp')

  .directive('quizGameDirective', quizGameDirective);

  quizGameDirective.$inject = ['$timeout', '$compile', '$interval'];

    function quizGameDirective($timeout, $compile, $interval) {

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

        var quizGameMainInfo = $('<div class="item item-divider"><div class="col text-center" id="gameStatusText">BOTH PLAYERS ARE READY!</div></div>').hide();

        var playersInfo = $(
          '<div id="playersDiv" class="list card">' +
          '<div class="item item-avatar">' +
          '<img src="">' +
          '<h2 class="userNickname">' + scope.quizGame_ctrl.gameData.players[0].username + '</h2>' +
          '<p>Personal Rating: ' + randomRating() + '</p>' +
          '</div>' +
          '</div>' +

          '<div id="playersDiv" class="list card">' +
          '<div class="item item-avatar">' +
          '<img src="">' +
          '<h2 class="userNickname">' + scope.quizGame_ctrl.gameData.players[1].username + '</h2>' +
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
              $('#catFound').append($('<div class="col">' + scope.category + '</div>').css('font-weight', 'bold'));

              $('#catFound').fadeIn('slow');

              var quizStartCounter = $('<a class="item" id="progressText">' + '<div id="progressbarText"></div>' +
                '<progress id="progressbar" value="2" max="2" class="progressbar"></progress>' +
                '</a>').hide();

              $('#quizGameArea').append(quizStartCounter);

              var actualValue = $('#progressbar').attr('value');

              $('#progressText').prepend($('<div>Quiz starting in <span>' + actualValue + '</span> sec...</div>'));

              quizStartCounter.show();

              var progressBarAnimate = $interval(function () {

                actualValue--;
                $('#progressbar').val(actualValue);
                $('#progressText > div > span').text(actualValue);

                console.log(actualValue);

                if (actualValue === 0) {
                  $interval.cancel(progressBarAnimate);
                  scope.$emit('start asking questions', 0);
                  $('#quizGameArea').empty();
                }

              }, 1000);

            }, 1500);

          }, 2000);

        }, 2000);

        scope.$on('show questions', function (event, i) {

          var questionsWindow = $('<ul class="list item-text-wrap" id="listWithQuestions">' +
            '<li class="item">' +
            '<span class="bold"></span>{{ actualQuestion }}' +
            '</li>' +
            '<a class="item" ng-click="quizGame_ctrl.userAnswer(data.answer)" ng-repeat="data in shuffledAnswers" id="{{ data.correct }}"' +
            'ng-class="{ \'correctAnswerGiven\' : clickedAnswer && showCorrectAnswer && data.correct == true,' +
            '\'incorrectAnswerGiven\' : data.answer == clickedAnswer && data.correct == false' +
            '}">' +
            '{{ data.answer }} ' +
            '</a> ' +
            '</ul>').hide();

          $compile(questionsWindow)(scope);
          $('#quizGameArea').append(questionsWindow);
          questionsWindow.fadeIn('slow');

          var questionTimerElement = $('<a class="item">' +
            'Time left: {{ questionTimer }}s' +
            '<progress id="questionTimer" value="2" max="2" class="progressbar"></progress>' +
            '</a>').hide();

          $compile(questionTimerElement)(scope);
          $('#quizGameArea').append(questionTimerElement);
          questionTimerElement.fadeIn('slow');

          scope.questionTimer = $('#questionTimer').attr('value');

          countTenSeconds(i);

          function countTenSeconds(i) {
            var tenSecInterval = $interval(function () {
              scope.questionTimer--;
              $('#questionTimer').val(scope.questionTimer);
              if (scope.questionTimer == 0) {
                $interval.cancel(tenSecInterval);
                updateAnswers(i, false);
              }
            }, 1000)
          }
        });


        function updateAnswers(i, answer) {

          if (i == 0) {
            var answersList = $('<div class="item item-divider" id="myAnswersInfo">' +
              '<div class="row">' +
              '<div class="col">Your answers:</div>' +
              '</div><div class="row text-center" id="myAnswersList">' +
              '<div ng-repeat="answer in myAnswers track by $index" ng-class="{\'correctAnswerDiv col col-33 answerButtons\' : answer.correctAnswer == true,' +
              '\'incorrectAnswerDiv col col-33 col-offset-5 answerButtons\' : answer.correctAnswer == false }">' +
              '{{ answer.question }}' +
              '</div></div></div>');
             $compile(answersList)(scope);
            answersList.insertAfter($('#quizGameArea'));
          }

          scope.myAnswers.push({'question': i + 1, 'correctAnswer': answer});

          scope.$emit('add answer', {'valid': answer, 'i': i}); //post the answer to DB

          i++;
          if (i < 3) {
            scope.$emit('start asking questions', i);
          } else {
            showResults();
          }
          $('#quizGameArea').empty();

        }


        function showResults() {


        }


      }
    }
  }

}) ();
