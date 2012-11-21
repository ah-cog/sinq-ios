//    .-'''-. .-./`) ,---.   .--.    ,-----.     
//   / _     \\ .-.')|    \  |  |  .'  .-,  '.   
//  (`' )/`--'/ `-' \|  ,  \ |  | / ,-.|  \ _ \  
// (_ o _).    `-'`"`|  |\_ \|  |;  \  '_ /  | : 
//  (_,_). '.  .---. |  _( )_\  ||  _`,/ \ _/  | 
// .---.  \  : |   | | (_ o _)  |: (  '\_/ \   ; 
// \    `-'  | |   | |  (_,_)\  | \ `"/  \  )  \ 
//  \       /  |   | |  |    |  |  '. \_/``"/)  )
//   `-...-'   '---' '--'    '--'    '-----' `-' 
//
// Author: Michael Gubbels
// Date: 2012-11-11
//
// Header ASCII art text generator:
//    http://patorjk.com/software/taag/

// SINQ server URL
var serverUrl = 'http://10.10.0.141';
// var serverUrl = 'http://129.2.101.49';

/*
 if (location.host == 'localhost') {
 // code for local version goes here
 serverUrl = 'http://localhost';
 } else {
 // code for online version goes here
 serverUrl = 'http://129.2.101.49';
 }
 */

 $(function() {

    var $container = $('#container');

    $container.isotope({
        masonry: {
            columnWidth: 120
        },
        sortBy: 'number',
        getSortData: {
            number: function( $elem ) {
                var number = $elem.hasClass('element') ? 
                    $elem.find('.number').text() :
                    $elem.attr('data-number');
                return parseInt( number, 10 );
            },
            alphabetical: function( $elem ) {
                var text = $elem.find('.text'),
                itemText = name.length ? text : $elem;
                return itemText.text();
            }
        }
    });


    /**
     * Set up filtering and sorting option buttons
     */
    var $optionSets = $('#options .option-set'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function() {
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
            return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');

        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
            // changes in layout modes need extra logic
            changeLayoutMode( $this, options );
        } else {
            // otherwise, apply new options
            $container.isotope( options );
        }

        return false;
    });

    /**
     * Initialize JavaScript callbacks
     */

    $('#dashboard_header_logo').click(function() {
        hideSections();

        // Remove all element type filters
        var options = {
            filter: '*'
        };
        $('#container').isotope(options);

        // Update the UI
        $('#container').slideDown('slow');
    });

    /**
     * Handler for entry point by question
     */
    $('#dashboard_header_question').click(function() {
        hideSections();
        $('#create-question-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form
        $('#create-question-form').unbind('submit').submit(function() {
            storeQuestion();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-question-form').submit();
        });
    });

    /**
     * Handler for entry point by cause-and-effect
     */
    $('#dashboard_header_causeandeffect').click(function() {
        hideSections();
        $('#create-causeandeffect-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form
        $('#create-causeandeffect-form').unbind('submit').submit(function() {
            storeHypothesis();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-causeandeffect-form').submit();
        });
    });

    $('#dashboard_header_investigation').click(function() {
        hideSections();
        $('#create-investigation-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form
        $('#create-investigation-form').unbind('submit').submit(function() {
            storeInvestigation();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-investigation-form').submit();
        });
    });




    /**
     * Initialize footer UI
     */
    $('#footer').hide();




    /**
     * Chosen question options
     */
    $('#selected-question-add-causeandeffect').click(function() {
        // Hide sections after question section
        $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        // $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
        $('#create-causeandeffect-section').slideDown('slow');

        // Open footer with "Submit" button
        $('#footer').slideDown('slow');
    });

    $('#selected-question-add-investigation').click(function() {
        // Hide sections after question section
        $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        // $('#create-question-section').slideUp('slow');
        // $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
        $('#create-investigation-section').slideDown('slow');
    });



    /**
     * Chosen cause-and-effect options
     */
    $('#selected-causeandeffect-add-question').click(function() {
        // Hide sections after question section
        $('#container').slideUp('slow');

        $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        // $('#selected-investigation-element').slideUp('slow');

        $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
        $('#create-question-section').slideDown('slow');
    });

    $('#selected-causeandeffect-add-investigation').click(function() {
        // Hide sections after question section
        $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
        $('#create-investigation-section').slideDown('slow');
    });

    /**
     * Initialize iScroll UI elements
     */
    init_iScroll();

});




var local_questions       = new Array();
var local_causeandeffects = new Array();
var local_investigations  = new Array();

// if(typeof(Storage) !== "undefined") {
//     // localStorage and sessionStorage are supported.
//     localStorage.clear();
// } else {
//     // No web storage support.
// }




//
// iScroll
//

function init_iScroll() {
    var maxNumTiles = 3000; // max number of "tiles" in the scroll area
    var tileWidth = 200; // width of "tiles"
    width = (maxNumTiles + 1) * tileWidth;
    height = 200;

    // determine the height dynamically
    $("#question-horizontalWrapper").css('height', height);
    $("#causeandeffect-horizontalWrapper").css('height', height);
    // $("#investigation-horizontalWrapper").css('height', height);

    // question_myScroll = new iScroll('question-horizontalWrapper');
    // causeandeffect_myScroll = new iScroll('causeandeffect-horizontalWrapper');
    // var investigation_myScroll = new iScroll('investigation-horizontalWrapper');

    // TODO: Place this in a function to call when the chosen question div is hidden (i.e., when slideUp is called?)?
    // pagehide = function () {
    //  myScroll.destroy();
    //  myScroll = null;
    // };
}

function slideUpFooter() {
    $('#footer').slideUp('slow');

    $('#footer-done-button').unbind('click');
}

 //  _____  _                       _____             
 // |  __ \| |                     / ____|            
 // | |__) | |__   ___  _ __   ___| |  __  __ _ _ __  
 // |  ___/| '_ \ / _ \| '_ \ / _ \ | |_ |/ _` | '_ \ 
 // | |    | | | | (_) | | | |  __/ |__| | (_| | |_) |
 // |_|    |_| |_|\___/|_| |_|\___|\_____|\__,_| .__/ 
 //                                            | |    
 //                                            |_|    

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var lastImageURI = null;

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

    // Check state of connection to data networks
    var states = checkConnection();

    document.addEventListener("online", onDeviceOnline, false);
    document.addEventListener("offline", onDeviceOffline, false);
    document.addEventListener("resume", onResume, false);
}

function onDeviceOnline() {
    alert("Device now online!");
    // TODO: Set storage destination to remote server
}

function onDeviceOffline() {
    alert("Device now offline!");
    // TODO: Set storage destination to local storage
}

function onResume() {
    // TODO: Refresh content.
}

// Check the state of the connection to a data networks
//
function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    // alert('Connection type: ' + states[networkState]);

    return states;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);
    
    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');
    
    // Unhide image elements
    //
    smallImage.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Cache image URI globally for later upload (upon form submit)
    lastImageURI = imageURI;
    
    // Get image handle
    //
    var photo_preview = document.getElementById('photo_preview');
    
    // Unhide image elements
    //
    photo_preview.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    photo_preview.src = lastImageURI;
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}

// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onPhotoDataSuccess,
        onFail,
        {
            quality: 50,
            destinationType: destinationType.DATA_URL
        });
}

// A button will call this function
//
function capturePhotoToURI() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onPhotoURISuccess, 
        onFail, 
        {
            quality: 50, 
            allowEdit: true,
            destinationType: navigator.camera.DestinationType.FILE_URI 
        });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onPhotoDataSuccess, 
        onFail, 
        {
            quality: 20,
            allowEdit: true,
            destinationType: destinationType.DATA_URL 
        });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(
        onPhotoURISuccess, 
        onFail, 
        { 
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source
        });
}

//   _____                         ________  __  __          _   
//  / ____|                       / /  ____|/ _|/ _|        | |  
// | |     __ _ _   _ ___  ___   / /| |__  | |_| |_ ___  ___| |_ 
// | |    / _` | | | / __|/ _ \ / / |  __| |  _|  _/ _ \/ __| __|
// | |___| (_| | |_| \__ \  __// /  | |____| | | ||  __/ (__| |_ 
//  \_____\__,_|\__,_|___/\___/_/   |______|_| |_| \___|\___|\__|
//

function onCauseAndEffectClick(pk) {

    // Add question to top (expand it)
    // Remove all questions from container
    // Filter out everything that isn't associated with the current question

    // local_questions[datum.pk].pk;
    // local_questions[datum.pk].fields.text;

    $('#selected-causeandeffect-cause').html(local_causeandeffects[pk].fields.cause);
    $('#selected-causeandeffect-effect').html(local_causeandeffects[pk].fields.effect);

    // Hide sections after question section
    $('#container').slideUp('slow');

    // $('#selected-question-element').slideUp('slow');
    $('#selected-causeandeffect-element').slideUp('slow');
    $('#selected-investigation-element').slideUp('slow');

    // $('#create-question-section').slideUp('slow');
    $('#create-causeandeffect-section').slideUp('slow');
    $('#create-investigation-section').slideUp('slow');

    // Get number of questions
    // Get number of investigations

    $('#container').slideUp('fast', function() {

        $('#selected-causeandeffect-element').slideDown('slow', function() {
            // Initialize iScroll element
            myScroll = new iScroll('causeandeffect-horizontalWrapper');

            // Hide all question elements
            var options = {
                filter: ':not(.question):not(.causeandeffect)'
            };
            $('#container').isotope(options);

            // Open the container again, showing only cause-and-effects and investigations for the selected question
            $('#container').slideDown('slow');
        });

    });

    // Show cause and effect elements for selected question
    // TODO: Query database and some number of random CEs

    // Show investigation elements for selected question
    // TODO: Query database to get some number of random INVs
}

function loadCauseAndEffects() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/hypotheses/?format=json",
        // data: ({name: theName}),
        cache: false,
        success: function(data) {

            // proceed only if we have data
            if ( !data || !data.length ) {
                ajaxError();
                return;
            }
            var items = [], item, datum;
            var item_ids = [];

            // Create HTML markup for retreived questions and add to a list
            for ( var i=0, len = data.length; i < len; i++ ) {
                datum = data[i];

                local_causeandeffects[datum.pk] = datum;

                var item = '<div id="hypothesis_' + datum.pk + '" class="causeandeffect hypothesis-' + datum.pk + ' element feature  width2 height2" data-option-key="filter" data-option-value=".hypothesis-' + datum.pk + '" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #fff84d; background-image:url(\'\');">'
                            // + '<a href="./hypothesis_view.html?pk=' + datum.pk + '">'
                            + '<a href="javascript:onCauseAndEffectClick(' + datum.pk + ');" data-option-value=".causeandeffect-' + datum.pk + '">'
                            + '<div style="width: 220px; height: 220px; border: 1px solid #30a382; padding: 2px; margin: 2px;">'
                                + '<h2 class="cause">' + datum.fields.cause + '</h2>'
                                + '<h2 class="effect">' + datum.fields.effect + '</h2>'
                            + '</div>'
                            + '</a>'
                        + '</div>';

                items.push( item );
                item_ids.push( datum.pk );
            }

            // Add class to queestion markup
            var $items = $( items.join('') ).addClass('causeandeffect');

            // set random number for each item
            $items.each(function() {
                $(this).attr('data-number', ~~( Math.random() * 100 + 15 ));
            });

            // Invoke the imagesLoaded plugin (included with Isotope) to properly lay out images in the Isotope container.
            var $container = $('#container');
            $items.imagesLoaded(function() {
                // $sitesTitle.removeClass('loading').text('Sites using Isotope');
                $container.append( $items );
                $items.each(function() {
                    var $this = $(this),
                    itemHeight = Math.ceil( $this.height() / 120 ) * 120 - 10;
                    $this.height( itemHeight );
                });

                // Actually insert the questions into the Isotope container.
                $container.isotope( 'insert', $items );
            });

            // Request images
            for(var i = 0   , len = item_ids.length; i < len; i++) {
                loadCauseAndEffectsImages(item_ids[i]);
            }
        }
    });
}

/**
 * Retreive images for the hypothesis with the specified primary key.
 */
function loadCauseAndEffectsImages(pk) {
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/hypotheses/" + pk + "/images/?format=json",
       // data: ({name: theName}),
       cache: false,
       success: function(responseData) {
           for(i in responseData) {
               var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
               // alert(imageUrl);
               //$('#question_' + pk + '_image').attr('src', imageUrl); // Reset all contents
               $('#hypothesis_' + pk).css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
               //$('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');
           }
       }
    });
}

function storeHypothesis() {

    // Get form data
    //var question_id = $('#question_id').val();
    var cause_text  = $('#cause_text').val();
    var effect_text = $('#effect_text').val();

    // Validate form
    if($("#photo_preview").attr('src') == '' || cause_text == '' || effect_text == '') {
        alert("You have to snap a photo and type a cause and effect.");
    }

    // Serialize data in JSON format
    var hypothesis = new Object();
    // if (question_id != '') {
    //     hypothesis.question_id = question_id;
    //     alert('has question id');
    // }
    hypothesis.cause_text = cause_text;
    hypothesis.effect_text = effect_text;

    var data = new Object(); // "Wrapper object" for hypothesis to be sent to server.
    data.hypothesis = hypothesis;

    var hypothesis_json = JSON.stringify(data);

    //alert(hypothesis_json);

    // Send serialized data to server
    $.ajax({
        type: 'POST',
        url: serverUrl + "/sinq/api/hypotheses/create/",
        data: hypothesis_json,
        success: function(responseData) {
            // alert('pk: ' + responseData[0].pk);
            var hypothesis_image_pk = parseInt(responseData[0].pk)
            addHypothesisImage(hypothesis_image_pk);
        }
        // dataType: 'json'
    });
}

function addHypothesisImage(hypothesis_pk) {

    // Upload the image to server
    function success(response) {
        // var response_json = JSON.stringify(response);
        // alert("upload successful" + response_json);
        // $.mobile.changePage( "./index.html" );
        $.mobile.changePage( "./hypothesis_view.html?pk=" + hypothesis_pk);
    }
    
    function fail(error) {
        alert("upload failed: " + error.code);
    }
    
    var options = new FileUploadOptions();
    options.fileKey = "hypothesis_image"; // parameter name of file -- in POST data?
    options.fileName = lastImageURI.substr(lastImageURI.lastIndexOf('/') + 1); // name of file
    options.mimeType = "image/jpeg";
    
    var ft = new FileTransfer();
    ft.upload(lastImageURI, serverUrl + '/sinq/api/hypotheses/' + hypothesis_pk + '/images/create/', success, fail, options);

    // Reset image URI
    lastImageURI = null;
}

function openHypothesis(pk) {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/api/hypotheses/" + pk + "/?format=json",
        //            data: ({name: theName}),
        //            cache: false,
        success: function(responseData) {
            $('#hypothesis_cause').html(responseData[0].fields.cause);
            $('#hypothesis_effect').html(responseData[0].fields.effect);
        }
    });
    
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/hypotheses/" + pk + "/images/?format=json",
       //            data: ({name: theName}),
       //            cache: false,
       success: function(responseData) {
           $('#hypothesis_images').html(''); // Reset all contents
           for(i in responseData) {
               var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
               // alert(imageUrl);
               $('#hypothesis_images').append('<img src="' + imageUrl + '" width="320" height="240" />');
           }
       }
    });
}

//  _____                     _   _             _   _             
// |_   _|                   | | (_)           | | (_)            
//   | |  _ ____   _____  ___| |_ _  __ _  __ _| |_ _  ___  _ __  
//   | | | '_ \ \ / / _ \/ __| __| |/ _` |/ _` | __| |/ _ \| '_ \ 
//  _| |_| | | \ V /  __/\__ \ |_| | (_| | (_| | |_| | (_) | | | |
// |_____|_| |_|\_/ \___||___/\__|_|\__, |\__,_|\__|_|\___/|_| |_|
//                                   __/ |                        
//                                  |___/                         

function storeInvestigation() {
    alert("TODO: Implement this!");
}

//   ____                  _   _                 
//  / __ \                | | (_)                
// | |  | |_   _  ___  ___| |_ _  ___  _ __  ___ 
// | |  | | | | |/ _ \/ __| __| |/ _ \| '_ \/ __|
// | |__| | |_| |  __/\__ \ |_| | (_) | | | \__ \
//  \___\_\\__,_|\___||___/\__|_|\___/|_| |_|___/

function showMessage(message) {
    alert(message);
}

function storeQuestion() {

    // Get form data
    var question_text = $('#question_text').val();

    // // Validate form
    if($("#photo_preview").attr('src') == '' || question_text == '') {
        showMessage("You have to snap a photo and type a question.");
    }

    // Serialize data in JSON format
    var question = new Object();
    question.text = question_text;

    var data = new Object();
    data.question = question;

    var question_json = JSON.stringify(data);

    //alert(question_json);

    // Send serialized data to server
    $.ajax({
        type: 'POST',
        url: serverUrl + "/sinq/api/questions/create/",
        data: question_json,
        success: function(responseData) {
            // alert('pk: ' + responseData[0].pk);
            var question_image_pk = parseInt(responseData[0].pk);
            // addQuestionImage(question_image_pk);

            $.mobile.changePage( "./question_view.html?pk=" + question_pk);
        }
        // dataType: 'json'
    });
}

function addQuestionImage(question_pk) {

    alert("addQuestionImage: " + question_pk);

    // Upload the image to server
    function success(response) {
        // alert("upload successful");
        // $.mobile.changePage( "./index.html" );
        $.mobile.changePage( "./question_view.html?pk=" + question_pk);
    }
    
    function fail(error) {
        alert("Your photo could not be uploaded.  (Error " + error.code + ")");
    }
    
    var options = new FileUploadOptions();
    options.fileKey = "question_image"; // parameter name of file -- in POST data?
    options.fileName = lastImageURI.substr(lastImageURI.lastIndexOf('/') + 1); // name of file
    options.mimeType = "image/jpeg";
    
    var ft = new FileTransfer();
    ft.upload(lastImageURI, serverUrl + '/sinq/api/questions/' + question_pk + '/images/create/', success, fail, options);

    // Reset image URI
    lastImageURI = null;
}

function loadQuestions() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/questions/?format=json",
        //            data: ({name: theName}),
        //            cache: false,
        success: function(data) {

            // proceed only if we have data
            if ( !data || !data.length ) {
                ajaxError();
                return;
            }
            var items = [], item, datum;
            var item_ids = [];

            // Create HTML markup for retreived questions and add to a list
            for ( var i=0, len = data.length; i < len; i++ ) {
                datum = data[i];

                // Create or update locally cached copy
                local_questions[datum.pk] = datum;
                if(!local_questions[datum.pk].hasOwnProperty('images')) {
                    local_questions[datum.pk]['images'] = new Array();
                }

                // Create HTML element to show in Isotope container
                var item = '<div id="question_' + datum.pk + '" class="question question-' + datum.pk + ' element feature width2 height2" data-option-key="filter" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #fff84d; background-image:url(\'\');">'
                            // + '<a href="#question-' + datum.pk + '" data-option-value=".question-' + datum.pk + '">'
                            + '<a href="javascript:onQuestionClick(' + datum.pk + ');" data-option-value=".question-' + datum.pk + '">'
                            + '<div style="width: 220px; height: 220px; border: 1px solid #54bef9; padding: 2px; margin: 2px;">'
                                + '<h2 class="text">' + datum.fields.text + '</h2>'
                            + '</div>'
                            + '</a>'
                        + '</div>';

                items.push( item );
                item_ids.push( datum.pk );
            }

            // Add class to queestion markup
            var $items = $( items.join('') ).addClass('question');

            // set random number for each item
            $items.each(function() {
                $(this).attr('data-number', ~~( Math.random() * 100 + 15 ));
            });

            // Invoke the imagesLoaded plugin (included with Isotope) to properly lay out images in the Isotope container.
            var $container = $('#container');
            $items.imagesLoaded(function() {
                // $sitesTitle.removeClass('loading').text('Sites using Isotope');
                $container.append( $items );
                $items.each(function() {
                    var $this = $(this),
                    itemHeight = Math.ceil( $this.height() / 120 ) * 120 - 10;
                    $this.height( itemHeight );
                });

                // Actually insert the questions into the Isotope container.
                $container.isotope( 'insert', $items );
            });





            /**
             * Set up per-question-element filtering to occur when clicked
             */

            // var $questionSets = $('#container .question'),
            //     $questionLinks = $questionSets.find('a');

            // $questionLinks.click(function() {

            //     $('#selected-question-text').html("BLAH");

            //     var $this = $(this);
            //     // don't proceed if already selected
            //     if ( $this.hasClass('selected') ) {
            //         return false;
            //     }

            //     // Remove ".selected" class from all currently-selected elements with class ".questions"
            //     var $questionSet = $this.parents('.question');
            //     $questionSet.find('.selected').removeClass('selected');
            //     $this.addClass('selected'); // Add ".selected" class to the current element

            //     // make option object dynamically, i.e. { filter: '.my-filter-class' }
            //     var options = {},
            //         key     = $questionSet.attr('data-option-key'),
            //         value   = $this.attr('data-option-value');
            //     // parse 'false' as false boolean
            //     value = value === 'false' ? false : value;
            //     options[ key ] = value;
            //     if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
            //         // changes in layout modes need extra logic
            //         changeLayoutMode( $this, options );
            //     } else {
            //         // otherwise, apply new options
            //         $container.isotope( options );
            //     }

            //     return false;
            // });





            // Request images
            for(var i = 0   , len = item_ids.length; i < len; i++) {
                loadQuestionImages(item_ids[i]);
            }
        }
    });
}

function hideSections() {
    $('#container').slideUp('fast');

    $('#selected-question-element').slideUp('fast');
    $('#selected-causeandeffect-element').slideUp('fast');
    $('#selected-investigation-element').slideUp('fast');

    $('#create-question-section').slideUp('fast');
    $('#create-causeandeffect-section').slideUp('fast');
    $('#create-investigation-section').slideUp('fast');
}

function onQuestionClick(pk) {

    // Add question to top (expand it)
    // Remove all questions from container
    // Filter out everything that isn't associated with the current question

    // local_questions[datum.pk].pk;
    // local_questions[datum.pk].fields.text;

    $('#selected-question-text').html(local_questions[pk].fields.text);

    // Hide sections after question section
    $('#container').slideUp('slow');

    $('#selected-causeandeffect-element').slideUp('slow');
    $('#selected-investigation-element').slideUp('slow');

    $('#create-question-section').slideUp('slow');
    $('#create-causeandeffect-section').slideUp('slow');
    $('#create-investigation-section').slideUp('slow');

    // Get number of cause and effect
    // Get number of investigations

    $('#container').slideUp('fast', function() {

        $('#selected-question-element').slideDown('slow', function() {

            // Add photos to scroller=
            var questionImages = local_questions[pk]['images'];
            for (question_image_pk in questionImages) {
                var imageUrl = serverUrl + '/media/' + questionImages[question_image_pk].fields.image;
                var imageItem = '<li><div style="width: 200px; height: 200px; border: 0px solid #54bef9; padding: 0px; margin: 0px; background-image: url(\'' + imageUrl + '\');"></div></li>';
                $('#selected-question-images').append(imageItem);
            }

            // Initialize iScroll element
            myScroll = new iScroll('question-horizontalWrapper');

            // Hide all question elements
            var options = {
                filter: ':not(.question)'
            };
            $('#container').isotope(options);

            // Open the container again, showing only cause-and-effects and investigations for the selected question
            $('#container').slideDown('slow');
        });

    });

    


    

    // Show cause and effect elements for selected question
    // TODO: Query database and some number of random CEs

    // Show investigation elements for selected question
    // TODO: Query database to get some number of random INVs
}

function loadQuestionImages(pk) {
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/api/questions/" + pk + "/images/?format=json",
       //            data: ({name: theName}),
       //            cache: false,
       success: function(responseData) {
           for(i in responseData) {
               var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
               // alert(imageUrl);
               //$('#question_' + pk + '_image').attr('src', imageUrl); // Reset all contents
               $('#question_' + pk).css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
               //$('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');

                // Create or update locally cached copy
                local_questions[pk]['images'][responseData[i].pk] = responseData[i];
           }
       }
    });
}

function openQuestion(pk) {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/questions/" + pk + "/?format=json",
        //            data: ({name: theName}),
        //            cache: false,
        success: function(responseData) {
            // alert(responseData[0].fields.text);
            $('#question_text').html(responseData[0].fields.text);
        }
    });
    
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/questions/" + pk + "/images/?format=json",
       //            data: ({name: theName}),
       //            cache: false,
       success: function(responseData) {
           $('#question_images').html(''); // Reset all contents
           for(i in responseData) {
               var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
               // alert(imageUrl);
               $('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');
           }
       }
    });
}