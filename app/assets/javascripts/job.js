"use strict";

(function($){
  var shortUrl = function() {
    var $el = $('[data-shorturl]');
    if($el.length == 1) {
      var url = $el.data('shorturl');
      $.get(url);
      window.setTimeout(shortUrl, 10000);
    }
  };

  var waitingStatus = function() {
    var $el = $('[data-statusurl]');
    if($el.length == 1) {
      var url = $el.data('statusurl');
      $.get(url);
      window.setTimeout(waitingStatus, 10000);
    }
  };

  var format_switch = function(format) {
    var $el = $('[name="job[iev_action]"]');
    if ($el.length == 1) {
      var val = $el.val();
      if (val == 'convert_job') {
        $('[data-convert-both="gtfs"]').addClass('hide');
        $('[data-convert-input="gtfs"]').addClass('hide');
        $('[data-convert-output="gtfs"]').addClass('hide');

        var format = $('[name="job[format]"]:checked').val();
        var format_convert = $('[name="job[format_convert]"]');

        if (format && format_convert.length > 0) {
          if(format == 'gtfs') {
            $('label[for="job_format_convert_convert_neptune"]').click();
          } else {
            $('label[for="job_format_convert_convert_gtfs"]').click();
          }
          var format_convert = $('[name="job[format_convert]"]:checked').val();
          if (format == 'gtfs') {
            $('[data-convert-both="gtfs"]').removeClass('hide');
            $('[data-convert-input="gtfs"]').removeClass('hide');
          }
          if (format_convert == 'convert_gtfs') {
            $('[data-convert-both="gtfs"]').removeClass('hide');
            $('[data-convert-output="gtfs"]').removeClass('hide');
          }
        }

        if (format == 'gtfs' || format_convert == 'convert_gtfs') {
          $('#cvd-FormBlock-moreOptions-button').show();
        } else {
          $('#cvd-FormBlock-moreOptions-button').hide();
        }
      }
    }
  };

  $(document).on('page:change', function () {
    window.setTimeout(waitingStatus, 10000);
    shortUrl();
    format_switch();
    $('[name="job[format]"]').change( function() {
      format_switch();
    });
    $('[name="job[format_convert]"]').change( function() {
      format_switch();
    });
  });
})(jQuery);