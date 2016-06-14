angular.module('pmApp.quizQueDirective', [])


  .directive('quizQueDirective', function () {

    return {

      restrict: 'E',
      replace: 'true',
      template: '<div id="quizQueArea"></div>',
      link: function (scope, elem, attr) {

        var quizQueArea = $('#quizQueArea');

        var quizMeChooser = $('' +
          '<div class="list" id="quizChooser">' +
          '<div class="item item-divider">' +
          'Please choose <span class="bold">QuizME</span> mode:' +
          '</div>' +
          '<a class="item text-center optionButton">' +
          'Regular mode' +
          '</a>' +
          '<a class="item text-center optionButton">' +
          'Ranked mode' +
          '</a>' +

          '<a class="item text-center optionButton">' +
          'Solo Quiz (no opponent)' +
          '</a>' +
          '</div>');

        var userCount = $('<div class="list" id="userCount">' +
          '<div class="item item-divider">' +
          'Quiz\'ing people atm:' +
          '</div>' +
          '<a class="item" href="#">' +
          'in Normal mode: 68' +
          '</a>' +
          '<a class="item" href="#">' +
          'in Ranked mode: 125' +
          '</a>' +
          '</div>');


        prepareView();

        function prepareView() {

          quizQueArea.append(quizMeChooser);
          quizQueArea.append(userCount);

          $('.optionButton').each(function () {
            var difficulty = this.innerHTML.substring(0, this.innerHTML.indexOf(' ')).toLowerCase();
            $(this).bind('click', function () {
              scope.$parent.quizQue_ctrl.startQuiz(difficulty);
            });
          });

        }


        scope.$on('startQuiz', function () {
          quizQueArea.empty();
          quizQueArea.append(
            '<div class="item item-divider spinnerDivider">' +
            '<div class="row">' +
            '<div class="col col-10" id="loadingDiv">' +
            '<div class="cssload-container"><div class="cssload-whirlpool"></div></div>' +
            '</div>' +
            '<div class="col spinnerText" id="gameStatusText">Game Search in progress...</div>' +
            '</div>' +
            '</div>');
        });


        scope.$on('user added to que', function () {
          var joinedQue = $('<a class="item queMarks" id="addedToQueMark">' +
            '<i class="icon ion-checkmark-round markIcon markGreen"></i><span class="markText">Joined the que</span></a>').hide();
          quizQueArea.append(joinedQue);
          joinedQue.fadeIn('slow');

          setTimeout(function () {
            var findingOpponent = $('<a class="item queMarks" id="lookingForOpponent">' +
              '<i class="icon ion-stats-bars markIcon markBlue"></i><span class="markText">Looking for opponent...</span></a>').hide();
            findingOpponent.insertAfter($('#addedToQueMark'));
            findingOpponent.fadeIn('slow');
          }, 1000);

          var cancelSearch = $('<a class="item text-center" id="cancelSearch">Cancel search</a>').hide();
          quizQueArea.append(cancelSearch);
          $('#cancelSearch').bind('click', scope.$parent.quizQue_ctrl.stopQue);
          cancelSearch.fadeIn('slow');
          console.log('userADdedToQue == true');

        });

        scope.$on('back to menu', function () {
          scope.$parent.quizQue_ctrl.quizMeStage = 'QuizME - lobby';
          scope.$apply();
          quizQueArea.empty();
          prepareView();
        });

        scope.$on('opponent found', function () {

          console.log('opponent found received');

          $('#cancelSearch').fadeOut('slow').remove();

          $('#lookingForOpponent > span').hide().text('Opponent found').fadeIn('slow');
          $('#lookingForOpponent > i').hide().removeClass('ion-stats-bars markBlue').addClass('ion-checkmark-round markGreen').fadeIn('slow');


          var preparingQuiz = $('<a class="item queMarks" id="preparingQuiz">' +
            '<i class="icon ion-stats-bars markIcon markBlue"></i><span class="markText">Preparing Quiz...</span></a>').hide();

          preparingQuiz.insertAfter($('#lookingForOpponent'));
          preparingQuiz.fadeIn('slow');
        });

        scope.$on('quiz prepared', function () {
          setTimeout(function () {
            $('#preparingQuiz > span').hide().text('Quiz prepared').fadeIn('slow');
            $('#preparingQuiz > i').hide().removeClass('ion-stats-bars markBlue').addClass('ion-checkmark-round markGreen').fadeIn('slow');

            scope.$parent.quizQue_ctrl.quizMeStage = 'QuizME';
            scope.$apply();
            $('#gameStatusText').addClass('text-center').text('GAME READY!');
            $('.cssload-container, #loadingDiv').remove();

            var confMenuQuestion = $('<div class="item item-divider text-center" id="confMenuQuestion">Would you like to start?</div>').hide();
            var confMenuAnswers = $('<div class="button-bar">' +
              '<a class="button button-balanced" id="yesAnswer">Yes</a>' +
              '<a class="button button-assertive" id="discardQuiz">No</a>' +
              '</div>').hide();

            $('#yesAnswer').bind('click', function () {
              scope.$parent.quizQue_ctrl.acceptQuiz();
            });
            $('#discardQuiz').bind('click', function () {
              scope.$parent.quizQue_ctrl.discardQuiz();
            });

            confMenuQuestion.insertAfter($('#preparingQuiz'));
            confMenuAnswers.insertAfter($('#confMenuQuestion'));
            
            confMenuQuestion.fadeIn('slow');
            confMenuAnswers.fadeIn('slow');


          }, 1500);
        });


      }
    }
  });
