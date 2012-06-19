
$(function() {

  $('#EditForm').eventStack({
//    async: false
  });

  $('#EditForm').eventStack('add', {
    trigger: function(){
      console.log('A done');
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
          eventStack.eventStack('resume', event);
        },
        success: function() {
          console.log('B done - async');
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
          eventStack.eventStack('resume', event);
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

    $('#EditForm').eventStack('destroy');
  });

  $('#EditForm').eventStack('fireAll');

});
