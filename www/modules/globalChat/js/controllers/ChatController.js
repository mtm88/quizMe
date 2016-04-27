/**
 * Created by pc on 2016-04-17.
 */
angular.module('pmApp.ChatCtrl', ['monospaced.elastic'])

.controller('ChatController', function($scope, $log, CHAT, localStorageService, $rootScope, $ionicScrollDelegate, chatService) {


   var footerBar = document.body.querySelector('#chatView .bar-footer');
   var scroller = document.body.querySelector('#chatView .scroll-content');
   var txtInput = angular.element(footerBar.querySelector('textarea'));

  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');



  $scope.$on('$destroy', function() {
    console.log('scope destroy');
    socket.disconnect();
  });

  $scope.$on('taResize', function(e, ta) {

      //console.log('taResize');
      if (!ta) return;

      var taHeight = ta[0].offsetHeight;
      //console.log('taHeight: ' + taHeight);

      if (!footerBar) return;

      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px';


  });


  var socket = io.connect(CHAT.url); // uzycie server.url jako constant zamiast IP/localhost pomoglo usunac problem z access-control origin !!!!!!!!!!!!!!!

  socket.on('connect_error', function(data) {
    console.log('connect error');
    console.log(data);
  });

   socket.on('connect', function() {
    console.log('connected');
  });

  socket.on('chat message', function(message) {

    var currentTime = new Date().toLocaleTimeString();

    var messageData = {
      user: message.user,
      message: message.message,
      timeAdded: currentTime
    };

    $scope.chat_ctrl.messages.push(messageData);
    $scope.$apply();
    viewScroll.scrollBottom();

  });

  /* socket.on('chat log', function(chatLog) {

    var definedLength = null;

    if(chatLog.length < 10)
      definedLength = 0;
    else
      definedLength = chatLog.length - 5;


    for( i = definedLength ; i < chatLog.length ; i++) {
      $scope.chat_ctrl.messages.push(chatLog[i]);
    }
    $scope.$apply();
    $ionicScrollDelegate.scrollBottom(true);
  });

  */

  socket.on('users online', function(usersOnline) {
    console.log('Users online: %s', usersOnline);
    $scope.chat_ctrl.usersOnline = usersOnline;
    $scope.$apply();
  });


  if(!this.messages)
    this.messages = [];

  var username = localStorageService.get('username');

  this.submitChatMsg = function() {
    keepKeyboardOpen();
    var currentTime = new Date().toLocaleTimeString();
    var message = { 'user' : username, 'message' : this.chatInput, timeAdded: currentTime };
    socket.emit('chat message', message);
    this.chatInput = '';
  };




  this.getChatLog = function() {

    // socket.emit('get chat log')

    chatService.getChatLog()
      .then(function(chatLog) {
        $scope.chat_ctrl.messages = chatLog;
      });

  };




  function keepKeyboardOpen() {
    console.log('keepKeyboardOpen');
    txtInput.on('blur', function() {
      console.log('textarea blur, focus back on it');
      txtInput[0].focus();
    });
  }

});


angular.module('monospaced.elastic', [])

  .constant('msdElasticConfig', {
    append: ''
  })

  .directive('msdElastic', [
    '$timeout', '$window', 'msdElasticConfig',
    function($timeout, $window, config) {
      'use strict';

      return {
        require: 'ngModel',
        restrict: 'A, C',
        link: function(scope, element, attrs, ngModel) {

          // cache a reference to the DOM element
          var ta = element[0],
            $ta = element;

          // ensure the element is a textarea, and browser is capable
          if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
            return;
          }

          // set these properties before measuring dimensions
          $ta.css({
            'overflow': 'hidden',
            'overflow-y': 'hidden',
            'word-wrap': 'break-word'
          });

          // force text reflow
          var text = ta.value;
          ta.value = '';
          ta.value = text;

          var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
            $win = angular.element($window),
            mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
              'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
              '-moz-box-sizing: content-box; box-sizing: content-box;' +
              'min-height: 0 !important; height: 0 !important; padding: 0;' +
              'word-wrap: break-word; border: 0;',
            $mirror = angular.element('<textarea tabindex="-1" ' +
              'style="' + mirrorInitStyle + '"/>').data('elastic', true),
            mirror = $mirror[0],
            taStyle = getComputedStyle(ta),
            resize = taStyle.getPropertyValue('resize'),
            borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
              taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
              taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
            boxOuter = !borderBox ? {width: 0, height: 0} : {
              width:  parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
              parseInt(taStyle.getPropertyValue('padding-right'), 10) +
              parseInt(taStyle.getPropertyValue('padding-left'), 10) +
              parseInt(taStyle.getPropertyValue('border-left-width'), 10),
              height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
              parseInt(taStyle.getPropertyValue('padding-top'), 10) +
              parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
              parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
            },
            minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
            heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
            minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
            maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
            mirrored,
            active,
            copyStyle = ['font-family',
              'font-size',
              'font-weight',
              'font-style',
              'letter-spacing',
              'line-height',
              'text-transform',
              'word-spacing',
              'text-indent'];

          // exit if elastic already applied (or is the mirror element)
          if ($ta.data('elastic')) {
            return;
          }

          // Opera returns max-height of -1 if not set
          maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

          // append mirror to the DOM
          if (mirror.parentNode !== document.body) {
            angular.element(document.body).append(mirror);
          }

          // set resize and apply elastic
          $ta.css({
            'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
          }).data('elastic', true);

          /*
           * methods
           */

          function initMirror() {
            var mirrorStyle = mirrorInitStyle;

            mirrored = ta;
            // copy the essential styles from the textarea to the mirror
            taStyle = getComputedStyle(ta);
            angular.forEach(copyStyle, function(val) {
              mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
            });
            mirror.setAttribute('style', mirrorStyle);
          }

          function adjust() {
            var taHeight,
              taComputedStyleWidth,
              mirrorHeight,
              width,
              overflow;

            if (mirrored !== ta) {
              initMirror();
            }

            // active flag prevents actions in function from calling adjust again
            if (!active) {
              active = true;

              mirror.value = ta.value + append; // optional whitespace to improve animation
              mirror.style.overflowY = ta.style.overflowY;

              taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

              taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

              // ensure getComputedStyle has returned a readable 'used value' pixel width
              if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                // update mirror width in case the textarea width has changed
                width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                mirror.style.width = width + 'px';
              }

              mirrorHeight = mirror.scrollHeight;

              if (mirrorHeight > maxHeight) {
                mirrorHeight = maxHeight;
                overflow = 'scroll';
              } else if (mirrorHeight < minHeight) {
                mirrorHeight = minHeight;
              }
              mirrorHeight += boxOuter.height;
              ta.style.overflowY = overflow || 'hidden';

              if (taHeight !== mirrorHeight) {
                ta.style.height = mirrorHeight + 'px';
                scope.$emit('elastic:resize', $ta);
              }

              scope.$emit('taResize', $ta); // listen to this in the UserMessagesCtrl

              // small delay to prevent an infinite loop
              $timeout(function() {
                active = false;
              }, 1);

            }
          }

          function forceAdjust() {
            active = false;
            adjust();
          }

          /*
           * initialise
           */

          // listen
          if ('onpropertychange' in ta && 'oninput' in ta) {
            // IE9
            ta['oninput'] = ta.onkeyup = adjust;
          } else {
            ta['oninput'] = adjust;
          }

          $win.bind('resize', forceAdjust);

          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            forceAdjust();
          });

          scope.$on('elastic:adjust', function() {
            initMirror();
            forceAdjust();
          });

          $timeout(adjust);

          /*
           * destroy
           */

          scope.$on('$destroy', function() {
            $mirror.remove();
            $win.unbind('resize', forceAdjust);
          });
        }
      };
    }
  ]);