/**
 * Created by pc on 2016-04-18.
 */

angular.module('pmApp.ChatCtrl')

.factory('chatSocket', function(socketFactory) {

  var socket = socketFactory();
  socket.forward('broadcast');
  return socket


});
