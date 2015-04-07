/*
$(document).ready(function() {
  $.ajax({
      url: '/result',
      type: 'get',
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      success: function(data) {
          $("#result").html(renderjson.set_show_by_default(true)(data));
      }
  });
});
*/
$("#linkForm").submit(function(event) {
  event.preventDefault();
  var link = $("#link").val();
  if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(link)) {
  //alert("valid url");
  } else {
  alert("invalid url");
  }
  //console.log(link);
  $.ajax({
        url: '/linksubmit',
        data:{'link':link},
        type: 'post',
        //dataType: 'json',
        //contentType: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            
            /*
            if (data.outcome === "win") {
                $("#info").html('<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Won!</strong>You won for <strong>' + id + '</strong>.</div>');
            } else if (data.outcome === "losses") {
                $("#info").html('<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Loss!</strong>You loss for <strong>' + id + '</strong>.</div>');
            } else if (data.outcome === "ties") {
                $("#info").html('<div class="alert alert-warning alert-dismissible"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>Tie!</strong>You tie for <strong>' + id + '</strong>.</div>');
            } else {
                $("#info").html();
            }
            $("#result").html(renderjson.set_show_by_default(true)(data));
            */
        }
      });
});
