/**
 * Created by pc on 2016-04-17.
 */
angular.module('pmApp.ChatCtrl', ['btford.socket-io'])

.value('nickName', 'anonymous')

.controller('ChatController', function($scope, $log, chatSocket, messageFormatter, nickName) {

  this.nickName = nickName;
  this.messageLog = 'Ready to chat!';

    this.sendMessage = function() {

      console.log($scope);

      var match = this.message.match('^\/nick (.*)');


      if(angular.isDefined(match) && angular.isArray(match) && match.length === 2) {

      var oldNick = nickName;
      nickName = match[1];
        this.message = '';
        this.messageLog = messageFormatter(new Date(), nickName, 'nickname changed - from ' + oldNick + ' to ' + nickName + '!') + this.messageLog;
        this.nickName = nickName;

    }

    $log.debug('sending message', this.message);

    chatSocket.emit('message', nickName, this.message);
    $log.debug('message sent', this.message);
    this.message = '';


    };


    $scope.$on('socket:broadcast', function(event, data) {

      console.log('dostalem broadcast');

        $log.debug('got a message', event.name);

        if(!data.payload) {
          $log.error('Invalid message', 'event', event,
                        'data', JSON.stringify(data));
          return;
        }

        $scope.$apply(function() {

          this.messageLog = messageFormatter(
              new Date(), data.source,
              data.payload) + this.messageLog;

        });

    });


});
