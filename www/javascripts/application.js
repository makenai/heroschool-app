$( document ).ready(function() {
	console.log("document ready");

  function serializeToObject(prev, curr, index, arr) {
    prev[curr.name] = curr.value;
    return prev;
  }

  $("#join-form").on("submit", function (e) {
    e.preventDefault();
    console.log("about to serialize");
    var formObj = $(this).serializeArray()
      .reduce(serializeToObject, {});

    console.log(formObj);
    if (false) {
	    $.mobile.navigate("#thanks");
    }
  });

});