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
            '<progress id="questionTimer" value="1" max="1" class="progressbar"></progress>' +
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
              '</div>' +
              '<div class="row text-center" id="myAnswersList">' +
              '<div ng-repeat="answer in myAnswers track by $index" ng-class="{\'correctAnswerDiv col col-33 answerButtons\' : answer.correctAnswer == true,' +
              '\'incorrectAnswerDiv col col-33 col-offset-5 answerButtons\' : answer.correctAnswer == false }">' +
              '{{ answer.question }}' +
              '</div></div></div>').hide();
            $compile(answersList)(scope);
            answersList.insertAfter($('#quizGameArea')).fadeIn('slow');
          }

          scope.myAnswers.push({'question': i + 1, 'correctAnswer': answer});

          scope.$emit('add answer', {'valid': answer, 'i': i}); //post the answer to DB

          i++;
          $('#quizGameArea').empty();
          if (i < 3) {
            scope.$emit('start asking questions', i);

          } else {
            var waitingForOppElems = $('<div class="item item-divider" id="waitingForOppElems">' +
              '<div class="row" id="opponentAnswersListSpinner">' +
              '<div class="col col-10" ng-hide="opponentAnswers">' +
              '<div class="cssload-container">' +
              '<div class="cssload-whirlpool"></div>' +
              '</div></div>' +
              '<div class="col spinnerText" >waiting for Opponent results...</div>' +
              '</div></div>').hide();

            waitingForOppElems.insertAfter($('#myAnswersInfo'));
            waitingForOppElems.fadeIn('slow');

            scope.$emit('category results from directive');
          }
        }


        scope.$on('opponent category results', function (event, opponentResults) {

          $timeout(function () {
            var oppResultsElems = $('<div class="item item-divider" id="oppResultsElems">' +
              '<div class="row">' +
              '<div class="col">Opponent answers:</div>' +
              '</div>' +
              '<div class="row text-center" id="opponentAnswersList">' +
              '<div ng-repeat="answer in opponentAnswers track by $index" ng-class="{\'correctAnswerDiv col col-33 answerButtons\' : answer.correctAnswer == true,' +
              '\'incorrectAnswerDiv col col-33 col-offset-5 answerButtons\' : answer.correctAnswer == false }">' +
              '{{ answer.questionNumber }}' +
              '</div>' +
              '</div></div>').hide();

            $compile(oppResultsElems)(scope);

            $('#waitingForOppElems').fadeOut('fast');

            oppResultsElems.insertAfter($('#myAnswersInfo'));
            oppResultsElems.fadeIn('slow');

            for (i = 0; i < 3; i++) {
              opponentResults[i].questionNumber = i + 1;
            }

            scope.opponentAnswers = opponentResults;
            scope.$apply();

            checkIfDraw();

          }, 1500);

        });

        scope.$on('new questions data from controller', function (event, data) {

            scope.$parent.questions = data.questions;
            scope.$parent.category = data.category;
            scope.loadingNewCategory = false; //used for choosing category after loss/win - might be up for removal

          $timeout(function () {

            $('#resultCard').empty();

            var newCategoryElems = $('<div class="item item-divider">' +
              '<div class="row" id="newCategoryRow">' +
              '<div class="col" id="newCategoryText"></div>' +
              '</div></div>').hide();
            $('#resultCard').append(newCategoryElems);
            newCategoryElems.fadeIn('slow');

            $('#newCategoryRow').prepend('<div class="col col-10">' +
              '<i class="icon ion-university markBlue"></i>' +
              '</div>');
            $('#newCategoryText').text('New category: ').css('font-size', '15px');
            $('#newCategoryRow').append($('<div class="col">' + scope.category + '</div>').css('font-weight', 'bold'));

            var newCatCounter = $('<a class="item" id="newCatCountElem">'
              + '<div id="newCatCountText"></div>' +
              '<progress id="newCatProgBar" value="3" max="3" class="progressbar"></progress>' +
              '</a>').hide();

            $('#resultCard').append(newCatCounter);
            newCatCounter.fadeIn('slow');

            var actualValue = $('#newCatProgBar').attr('value');

            $('#newCatCountText').prepend($('<div>Quiz starting in <span>' + actualValue + '</span> sec...</div>'));

            var progressBarAnimate = $interval(function () {

              actualValue--;
              $('#newCatProgBar').val(actualValue);
              $('#newCatCountText > div > span').text(actualValue);

              if (actualValue === 0) {
                $interval.cancel(progressBarAnimate);
                //clean data from previous category
                scope.myAnswers = [];
                scope.opponentAnswers = [];

                scope.usedCategories.push(scope.category);

                scope.$emit('start asking questions', 0);
                $('#myAnswersInfo').remove();
                $('#oppResultsElems').remove();
                $('#quizGameArea').empty();
                $('#resultCard').remove();
              }
            }, 1000);
          }, 2000);
        });

        function checkIfDraw() {

          var resultsElem = $('<div class="card" id="resultCard">' +
            '<div class="item item-divider">' +
            'Results' +
            '</div>' +
            '</div>').hide();

          resultsElem.insertAfter($('#oppResultsElems'));
          resultsElem.fadeIn('slow');

          if (scope.usedCategories.length == 3) {
            scope.$emit('directive requests final results');
          }

          else {

            var answersCountArray = decideWhoWon();

            var myCorrectAnswersCount = answersCountArray[0];
            var opponentCorrectAnswersCount = answersCountArray[1];

            if (myCorrectAnswersCount > opponentCorrectAnswersCount) {
              $('#infoOnNewCategory').text('You have won this category');
              $('#newCategorySpinner').show(400);
              $('#categorySpinnerText').text('Opponent choosing next category...');
            }

            else if (myCorrectAnswersCount < opponentCorrectAnswersCount) {
              $('#infoOnNewCategory').text('You have lost this category');
              $('#newCategorySpinner').hide(200);
              $('#chooseCategoryAfterLoss').show(400);
              $('#categoryChooserSpinnerText').text('Rolling categories...');
              //socket.emit('bring categories to choose', scope.usedCategories, scope.quizGame_ctrl.gameData.quizID);

            }

            else {

              var categoryResultsElems = $('<div class="item item-text-wrap">' +
                '<div>We have a draw!</div>').hide();
              $('#resultCard').append(categoryResultsElems);
              categoryResultsElems.fadeIn('slow');

              scope.$emit('directive requests for draw');

              $timeout(function () {

                var newCatElem = $('<div class="item item-text-wrap">' +
                  '<div class="row" id="spinnerDividerRow">' +
                  '<div class="col col-10">' +
                  '<div class="cssload-container"><div class="cssload-whirlpool"></div></div>' +
                  '</div>' +
                  '<div class="col spinnerText" id="gameStatusText">Rolling new category...</div>' +
                  '</div></div>').hide();

                $('#resultCard').append(newCatElem);
                newCatElem.fadeIn('slow');
              }, 1500);
            }
          }
        }

        function decideWhoWon() {

          var myCorrectAnswers = 0;
          var opponentCorrectAnswers = 0;

          for (i = 0; i < scope.myAnswers.length; i++) {

            if (scope.myAnswers[i].correctAnswer == true)
              myCorrectAnswers++;
            if (scope.opponentAnswers[i].correctAnswer == true)
              opponentCorrectAnswers++;
          }
          return [myCorrectAnswers, opponentCorrectAnswers];
        }


        scope.$on('final quiz results', function (quizAnswersArray) {


          console.log('pokazuje finalowe rezultaty');

          var finalResultsElems = $('<div class="item item-text-wrap">' +
            '<div>Your correct answer count: {{ myAnswersResults }}</div>' +
            '<div>Opponent correct answer count: {{ opponentAnswerResults }}</div>' +
            '</div>').hide();

          $compile(finalResultsElems)(scope);

          $('#resultCard').append(finalResultsElems);
          finalResultsElems.fadeIn('slow');
          scope.$emit('directive requests for final results');

          var myPositionInArray = quizAnswersArray[0];
          var opponentPositionInArray = '';
          if (myPositionInArray == 1)
            opponentPositionInArray = 2;
          else
            opponentPositionInArray = 1;

      /*    $timeout(function () {
            $scope.myAnswersResults = quizAnswersArray[myPositionInArray];
            $scope.opponentAnswerResults = quizAnswersArray[opponentPositionInArray];

            if ($scope.myAnswersResults > $scope.opponentAnswerResults)
              $('#finalResultsInfoFrame').text('You have won the Quiz :-)');

            else if ($scope.myAnswersResults < $scope.opponentAnswerResults)
              $('#finalResultsInfoFrame').text('You have lost the Quiz :-(');

            else
              $('#finalResultsInfoFrame').text('Quiz ended as a draw');

            $('#finalResultsDiv').show();

          }); */
        });
      }
    }
  }

})();
