
$(function() {

  $('#EditForm').eventStack({
    async: false
  });

  $('#EditForm').eventStack('add', {
    trigger: function(event, stack){
      console.log('A done');
//      stack.eventStack('stop');
    }
  });
  $('#EditForm').eventStack('add', {
    trigger: function(event, stack){
      $.ajax({
        type: 'POST',
        url: 'index.php',
        dataType: 'json',
        data: {
          action: 'xpto'
        },
        complete: function() {
          stack.eventStack('complete', event);
        },
        success: function() {
          console.log('B done - async');
//          stack.eventStack('pause', event);
        },
        error: function() {
          event.setStatus('error');
        }
      });
    },
    isAjax: true
  });
  $('#EditForm').eventStack('add', {
    trigger: function(){
      console.log('C done');
    }
  });
  $('#EditForm').eventStack('add', {
    trigger: function(event, eventStack){
      $.ajax({
        type: 'POST',
        url: 'index.php',
        dataType: 'json',
        data: {
          action: 'xpto'
        },
        complete: function() {
          eventStack.eventStack('complete', event);
        },
        success: function() {
          console.log('D done - async');
        }
      });
    },
    isAjax: true
  });

  $('#EditForm').bind('afterTriggerAll.eventStack', function() {
    console.info('all done!');

//    $('#EditForm').eventStack('destroy');
  });

  $('#EditForm').eventStack('fireAll');

});
