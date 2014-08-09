$( document ).ready(function() {
  
  $('#join-form').submit(function(e) {
    e.preventDefault();
    $.mobile.navigate("#thanks");
  });

});