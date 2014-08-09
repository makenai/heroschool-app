$( document ).ready(function() {
  function serializeToObject(prev, curr, index, arr) {
    prev[curr.name] = curr.value;
    return prev;
  }
  function addParseProps(prev, curr, index, arr) {
    return prev.set(index, curr);
  }
  var Recipient = Parse.Object.extend("Recipient");

  $("body").on("submit", "#join-form", function (e) {
    e.preventDefault();
    // console.log("about to serialize");
    var formObj = _.reduce($(this).serializeArray(), 
        serializeToObject, {}),
      recipient = new Recipient;

    recipient = _.reduce(formObj, addParseProps, recipient);
    
    recipient.save(null, {
      success: function(recip) {
        // Hooray! Let them use the app now.
        console.log("success");
      },
      error: function(recip, error) {
        // Show the error message somewhere and let the user try again.
        console.log("Error: " + error.code + " " + error.message);
        // alert("Error: " + error.code + " " + error.message);
      }
    });


    if (false) {
	    $.mobile.navigate("#thanks");
    }
  });

});