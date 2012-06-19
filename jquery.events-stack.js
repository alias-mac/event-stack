/**
 * Events Stack plugin for jQuery
 * http://jquery.com/
 *
 * Copyright (c) 2012 Filipe Guerra, João Morais
 * https://github.com/alias-mac/event-stack/blob/master/LICENSE
 *
 * @license MIT
 *   See LICENSE shipped with this file.
 */
(function($){

  "use strict";

  var defaultOptions = {
    async: true
  };

  var defaultEventOptions = {
    isAjax: false
  }

  var methods = {

    init: function(options) {

      return this.each(function() {
        var $this = $(this);
        var data = $this.data('eventStack');
        if (!data) {
          $this.data('eventStack', {
            target: $this,
            options: _overrideOptions(options),
            events: new Array()
          });
        }
      });
    },

    add: function(event) {
      var $this = $(this);

      if (!$.isFunction(event.trigger)) {
        throw 'EventStack: Event function not defined.';
      }
      $.extend(true, {}, defaultEventOptions, event);

      $this.data('eventStack').events.push(event);
    },

    remove: function(event) {
      var $this = $(this);
      var events = $this.data('eventStack').events;

      var pos = $.inArray(event, events);
      events.splice(pos, 1);
    },

    stop: function() {
      // TODO check what we need to keep this sane!
    },

    resume: function(event) {
      var $this = $(this);
      _resume(event, $this);
    },

    fireAll: function() {
      var $this = $(this);
      var $self = $this.data('eventStack').target;
      var options = $self.data('eventStack').options;
      var events = $this.data('eventStack').events;

      $this.data('eventStack').runningEvents = $.extend(true, [], events);

      $self.triggerHandler('beforeTriggerAll.eventStack');

      if (options.async) {
        $.each(events, function(i, event) {
          event.status = 'running';
          _fire(event, $this);
          if (!event.isAjax) {
            _resume(event, $this);
          }
        });
      }
      else {
        _fireNext($this);
      }
    },

    destroy: function() {
      var $this = $(this);

      $this.removeData('eventStack');
    }

  };

  $.fn.eventStack = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.eventStack');
    }
  };

  function _overrideOptions(options) {
    var settings = {};
    $.extend(true, settings, defaultOptions, options);
    return settings;
  }

  function _fire(event, $this) {
    var $self = $this.data('eventStack').target;

    var proceed = $self.triggerHandler('beforeTrigger.eventStack', event);
    if (proceed === false) {
      return;
    }
    (event.trigger)(event, $this);
    $self.triggerHandler('afterTrigger.eventStack', event);
  }

  function _fireNext($self) {
    var options = $self.data('eventStack').options;

    if (options.async) {
      return;
    }

    var runningEvents = $self.data('eventStack').runningEvents;
    if (runningEvents.length == 0) {
      return;
    }

    var event = runningEvents[0];
    event.status = 'running';
    _fire(event, $self);
    if (!event.isAjax) {
      _resume(event, $self);
    }
  }

  function _resume(event, $self) {
    var runningEvents = $self.data('eventStack').runningEvents;

    event.status = 'ready';
    var pos = $.inArray(event, runningEvents);
    runningEvents.splice(pos, 1);

    _fireNext($self);

    if (runningEvents.length == 0) {
      $self.triggerHandler('afterTriggerAll.eventStack');
      return;
    }
  }

})(jQuery);