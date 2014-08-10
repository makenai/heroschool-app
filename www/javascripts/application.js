$( document ).ready(function() {
  function serializeToObject(prev, curr, index, arr) {
    prev[curr.name] = curr.value;
    return prev;
  }
  function addParseProps(prev, curr, index, arr) {
    return prev.set(index, curr);
  }

  var Recipient = Parse.Object.extend("Recipient"),
    Hero = Parse.Object.extend("Hero"),
    heroId;
    templateFuncs = {
      "which-hero-are-you": function (jqContainer) {
        var query = new Parse.Query(Hero);
        query.find({
          success: function(results) {
            // alert("Successfully retrieved " + results.length + " scores.");
            // Do something with the returned Parse.Object values
            var compiledTemplate = Handlebars.compile($("#whichHeroTemp").html());
            var finishedTemplate = compiledTemplate({heroes: results});
            var templateTarget = jqContainer.find(".ui-content:first");
            // console.log(finishedTemplate);
            templateTarget.html(finishedTemplate);
            templateTarget.trigger('create');
          },
          error: function(error) {
            console.error("Error: " + error.code + " " + error.message);
          }
        });
      },
      "detailHero": (function () {
        var sessionCache = {};
        return function (jqContainer) {
          var objId = heroId || localStorage.heroId;
          console.log(objId);
          var query = new Parse.Query(Hero);
          query.equalTo("objectId", objId);
          query.first({
            success: function(hero) {
              // Successfully retrieved the hero.
              console.log(hero);
              var compiledTemplate = Handlebars.compile($("#detailHeroTemp").html());
              var finishedTemplate = compiledTemplate(hero);
              var templateTarget = jqContainer;//.find(".ui-content:first");
              // console.log(finishedTemplate);
              templateTarget.html(finishedTemplate);
              templateTarget.trigger('create');

            },
            error: function(error) {
              alert("Error: " + error.code + " " + error.message);
            }
          });
        };
      } ())
    };

  $("body").on("click", "#detailHero a[data-hero-type]", function () {
    var jqThis = $(this),
      heroName = jqThis.attr("data-hero-type"),
      jqSelect = $("#text-hero-type");
    jqSelect.find("[selected]").removeAttr("selected");
    jqSelect.find("[value=" + heroName + "]").attr("selected", "selected");
  });
  $("body").on("click", "#which-hero-are-you .heroTypeLi", function () {
    heroId = $(this).attr("data-hero-id");
    localStorage.heroId = heroId;
  });
  $("body").on("submit", "#join-form", function (e) {
    e.preventDefault();
    // console.log("about to serialize");
    var formObj = _.reduce($(this).serializeArray(), 
        serializeToObject, {}),
      recipient = new Recipient;

    recipient = _.reduce(formObj, addParseProps, recipient);
    
    var jqUpload = $("#selfieImage");
    var fileUploadControl = jqUpload[0];
    if (fileUploadControl.files.length > 0) {
      var file = fileUploadControl.files[0];
      var name = jqUpload.val();
     
      var parseFile = new Parse.File(name, file);
      parseFile.save().then(function() {
        // The file has been saved to Parse.
        console.log("saved file");
        recipient.set("selfieImage", parseFile);
        recipient.save(null, {
        success: function(recip) {
          // Hooray! Let them use the app now.
          console.log("success!");
        },
        error: function(recip, error) {
          // Show the error message somewhere and let the user try again.
          console.log("Error: " + error.code + " " + error.message);
          // alert("Error: " + error.code + " " + error.message);
        }
      });
      }, function(error) {
        // The file either could not be read, or could not be saved to Parse.
        console.log(error + "error saving file");
      });
    } else {

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
    }


    if (false) {
	    $.mobile.navigate("#thanks");
    }
  });

  $(":mobile-pageContainer").on( "pagecontainerbeforeshow",
    templLoad );

  function templLoad(e, ui) {
    // var prevPage = ui.prevPage;
    var jqToPage = ui.toPage;
    if (jqToPage.hasClass("untemp") || jqToPage.hasClass("alwaysTemp") || jqToPage.attr("id") === "detailHero") {
      jqToPage.removeClass("untemp");
      templateFuncs[jqToPage.attr("id")](jqToPage);
    }
    
  }

  $( ":mobile-pagecontainer" ).on( "pagecontainershow", function( event, ui ) {
    // console.log( "This page was just hidden: ");
    // console.log(ui.prevPage );
  });

});