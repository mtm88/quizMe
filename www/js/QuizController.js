angular.module('pmApp.QuizCtrl', ['pmApp.quizQueServices'])


.controller('QuizController', ['$scope', 'quizQueServices', function($Scope, quizQueServices) {

    $('#quizSearcher').hide();


    this.startQuiz = function(difficulty) {
      $('#quizChooser').hide();
      $('#quizSearcher').show();
      quizQueServices.addToQue(difficulty)
        .then(function(response) {
          console.log(response);
        })

    };

    this.stopQue = function() {
      $('#quizSearcher').hide();
      $('#quizChooser').show();
      quizQueServices.removeFromQue()
        .then(function(response) {
          console.log(response);
        })
    }





}]);
