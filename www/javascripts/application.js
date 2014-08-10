$( document ).ready(function() {
  function serializeToObject(prev, curr, index, arr) {
    prev[curr.name] = curr.value;
    return prev;
  }
  function addParseProps(prev, curr, index, arr) {
    return prev.set(index, curr);
  }

  var Recipient = Parse.Object.extend("Recipient"),
    templateFuncs = {
      "which-hero-are-you": function (jqContainer) {
        var Hero = Parse.Object.extend("Hero"),
          query = new Parse.Query(Hero);
        query.find({
          success: function(results) {
            // alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned Parse.Object values
            console.log(results);
            console.log(jqContainer);
            var compiledTemplate = Handlebars.compile($("#whichHeroTemp").html());
            var finishedTemplate = compiledTemplate({heroes: results});
            var templateTarget = jqContainer.find(".ui-content:first");
            // console.log(finishedTemplate);
            templateTarget.html(finishedTemplate);
            templateTarget.find("ul").listview();
          },
          error: function(error) {
            console.error("Error: " + error.code + " " + error.message);
          }
        });
      }
    };

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

  $(":mobile-pageContainer").on( "pagecontainerbeforeshow",
    templLoad );

  function templLoad(e, ui) {
    // var prevPage = ui.prevPage;
    var jqToPage = ui.toPage;
    if (jqToPage.hasClass("untemp") || jqToPage.hasClass("alwaysTemp")) {
      jqToPage.removeClass("untemp");
      templateFuncs[jqToPage.attr("id")](jqToPage);
    }
    
  }

  $( ":mobile-pagecontainer" ).on( "pagecontainershow", function( event, ui ) {
    // console.log( "This page was just hidden: ");
    // console.log(ui.prevPage );
  });

});