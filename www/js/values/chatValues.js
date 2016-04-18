/**
 * Created by pc on 2016-04-18.
 */

angular.module('pmApp.ChatCtrl')

.value('messageFormatter', function(date, nick, message) {
  console.log('messageFormatter');

  return date.toLocaleTimeString() + ' - ' + nick + ' - ' + message + '\n';

});
