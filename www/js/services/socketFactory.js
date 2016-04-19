/**
 * Created by pc on 2016-04-19.
 */

angular.module('pmApp.ChatCtrl')

.factory('socket', function($rootScope, SERVER) {

  var socket = io.connect(SERVER.url); // uzycie server.url jako constant zamiast IP/localhost pomoglo usunac problem z access-control origin !!!!!!!!!!!!!!!

  socket.on('connect', function() {
    console.log('socket connected');
  });

  socket.on('connect_error', function(data) {
    console.log('socket connect error');
    console.log(data);
  });

  return {

    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }

  }

});
