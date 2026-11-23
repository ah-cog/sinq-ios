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
// var serverUrl = 'http://10.10.0.141';
var serverUrl = 'http://129.2.101.49';
// var serverUrl = '192.168.1.141';

/*
 if (location.host == 'localhost') {
 // code for local version goes here
 serverUrl = 'http://localhost';
 } else {
 // code for online version goes here
 serverUrl = 'http://129.2.101.49';
 }
 */

 var create_investigation_step_counter = 1;

 $(function() {

    /**
     * Set up Isotope container
     */

    var $container = $('#container');

    $container.isotope({
        layoutMode: 'masonry',
        masonry: {
            columnWidth: 120,
            gutterWidth: 50
        },
        sortBy: 'dateLastModified',
        sortAscending: false,
        getSortData: {
            number: function( elem ) {
                var number = elem.hasClass('element') ? 
                    elem.find('.number').text() :
                    elem.attr('data-number');
                return parseInt( number, 10 );
            },
            alphabetical: function(elem) {
                var text = elem.find('.text'),
                itemText = name.length ? text : elem;
                return itemText.text();
            },
            dateLastModified: function(elem) {
                var date = elem.attr('data-date-last-modified');
                return date;
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

    $('#dashboard_header_discover').click(function() {
        showDashboard();
    });

    /**
     * Handler for entry point by question
     */
    $('#dashboard_header_question').click(function() {
        hideSections();
        resetCreateQuestionForm();
        $('#create-question-section').slideDown('slow', function() {
            // alert($('#question_text').attr('val'));
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
            showDashboard();
        });
    });

    /**
     * Handler for entry point by cause-and-effect
     */
    $('#dashboard_header_causeandeffect').click(function() {
        hideSections();
        resetCreateCauseAndEffectForm();
        $('#create-causeandeffect-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form
        $('#create-causeandeffect-form').unbind('submit').submit(function() {
            storeCauseAndEffect();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-causeandeffect-form').submit();
            // showDashboard();
        });
    });

    /**
     * Handler for entry point by investigation
     */
    $('#dashboard_header_investigation').click(function() {
        hideSections();
        resetCreateInvestigationForm();
        $('#create-investigation-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form submit
        $('#create-investigation-form').unbind('submit').submit(function() {
            storeInvestigation();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-investigation-form').submit();
            showDashboard();
        });
    });

    /**
     * Initialize create investigation form
     */

    create_investigation_step_counter = 1;

    // Set click callback function for "add step to investigation" button in create investigation form
    $('#create-investigation-step-button').unbind('click').click(function() {
        var placeholderText = 'Touch here to type what to do after Step ' + (create_investigation_step_counter - 1) + '.';
        if (create_investigation_step_counter == 1) {
            placeholderText = 'Touch here to type the what to do first.';
        }
        var step_div = 
            '<div id="create-investigation-step-' + create_investigation_step_counter + '" class="create-investigation-step" data-investigation-step-number="' + create_investigation_step_counter + '">' +
                '<div data-role="fieldcontain" class="ui-hide-label">' +
                        '<h2>Step ' + create_investigation_step_counter + '</h2>' +
                        '<label for="investigation-step-' + create_investigation_step_counter + '-text">Type step ' + create_investigation_step_counter + ' below:</label>' +
                        '<input id="investigation-step-' + create_investigation_step_counter + '-text" name="investigation-step-' + create_investigation_step_counter + '-text" type="text" placeholder="' + placeholderText + '" style="font-size: 18pt;" />' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="spacer">&nbsp;</div>';
        create_investigation_step_counter++;
        $('#create-investigation-steps').append(step_div).trigger('create'); // Trigger "create" event to make jQuery Mobile initialize the new markup
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
        // $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        // $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
        $('#create-causeandeffect-section').slideDown('slow', function() {
            $('#footer').slideDown('slow');
        });

        // Bind handler to form
        $('#create-causeandeffect-form').unbind('submit').submit(function() {
            storeCauseAndEffect();
            $('#footer').slideUp('slow');
            return false; // Return false to prevent form from submitting
        });

        // Set click callback function for "Done" button in footer
        $('#footer-done-button').unbind('click').click(function() {
            $('#create-causeandeffect-form').submit();
        });
    });

    $('#selected-question-add-investigation').click(function() {
        // Hide sections after question section
        // $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        // $('#create-question-section').slideUp('slow');
        // $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
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
            showDashboard();
        });
    });



    /**
     * Chosen cause-and-effect options
     */
    $('#selected-causeandeffect-add-question').click(function() {
        // Hide sections after question section
        // $('#container').slideUp('slow');

        $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        // $('#selected-investigation-element').slideUp('slow');

        $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
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
            showDashboard();
        });
    });

    $('#selected-causeandeffect-add-investigation').click(function() {
        // Hide sections after question section
        // $('#container').slideUp('slow');

        // $('#selected-question-element').slideUp('slow');
        // $('#selected-causeandeffect-element').slideUp('slow');
        $('#selected-investigation-element').slideUp('slow');

        $('#create-question-section').slideUp('slow');
        $('#create-causeandeffect-section').slideUp('slow');
        $('#create-investigation-section').slideUp('slow');

        // Open section
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
            showDashboard();
        });
    });

    /**
     * Initialize iScroll UI elements
     */
    init_iScroll();

});




var local_questions       = [];
var local_causeandeffects = [];
var local_investigations  = [];

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

var pictureUriCache = [];

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
    // alert("Device now online!");
    // TODO: Set storage destination to remote server
}

function onDeviceOffline() {
    // alert("Device now offline!");
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
function onCauseAndEffectPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);
    // alert(imageURI);

    // Cache image URI globally for later upload (upon form submit)
    pictureUriCache.causeandeffect = imageURI;
    
    // Get image handle
    //
    var cause_and_effect_photo = document.getElementById('cause-and-effect-photo');
    
    // Unhide image elements
    //
    cause_and_effect_photo.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    cause_and_effect_photo.src = pictureUriCache.causeandeffect;
}

// Called when a photo is successfully retrieved
//
function onQuestionPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Cache image URI globally for later upload (upon form submit)
    pictureUriCache.question = imageURI;
    
    // Get image handle
    //
    var question_photo = document.getElementById('question-photo');
    
    // Unhide image elements
    //
    question_photo.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    question_photo.src = pictureUriCache.question;
}

// Called when a photo is successfully retrieved
//
function onInvestigationPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // console.log(imageURI);

    // Cache image URI globally for later upload (upon form submit)
    pictureUriCache.investigation = imageURI;
    
    // Get image handle
    //
    var investigation_photo = document.getElementById('investigation-photo');
    
    // Unhide image elements
    //
    investigation_photo.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    investigation_photo.src = pictureUriCache.investigation;
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
function captureQuestionPhotoToURI() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onQuestionPhotoURISuccess, 
        onFail, 
        {
            quality: 50, 
            allowEdit: true,
            destinationType: navigator.camera.DestinationType.FILE_URI 
        });
}

// A button will call this function
//
function captureCauseAndEffectPhotoToURI() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onCauseAndEffectPhotoURISuccess, 
        onFail, 
        {
            quality: 50, 
            allowEdit: true,
            destinationType: navigator.camera.DestinationType.FILE_URI 
        });
}

// A button will call this function
//
function captureInvestigationPhotoToURI() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(
        onInvestigationPhotoURISuccess, 
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

    // Populate element
    $('#selected-causeandeffect-pk').val(local_causeandeffects[pk].pk);
    $('#selected-causeandeffect-cause').html(local_causeandeffects[pk].fields.cause);
    $('#selected-causeandeffect-effect').html(local_causeandeffects[pk].fields.effect);

    // Hide sections after question section
    // $('#container').slideUp('slow');

    // $('#selected-question-element').slideUp('slow');
    $('#selected-causeandeffect-element').slideUp('slow');
    $('#selected-investigation-element').slideUp('slow');

    // $('#create-question-section').slideUp('slow');
    $('#create-causeandeffect-section').slideUp('slow');
    $('#create-investigation-section').slideUp('slow');


    $("#container").isotope('remove', $('#container').find('.element'));

    // Set options for selected elements
    var options = {};

    options.causeandeffect_id = pk;
    
    if( $('#selected-question-element').is(':visible') ) {
        options.question_id = $('#selected-question-pk').val();
    }

    if( $('#selected-investigation-element').is(':visible') ) {
        options.investigation_id = $('#selected-investigation-pk').val();
    }

    loadQuestions(options);
    loadInvestigations(options);

    // Get number of questions
    // Get number of investigations

    $('#container').slideUp('fast', function() {

        $('#selected-causeandeffect-element').slideDown('slow', function() {

            // Add photos to scroller
            $('#selected-causeandeffect-images').html('');
            if(local_causeandeffects[pk].images.length > 0) {
                $('#causeandeffect-image-section').show();
                for (var causeandeffect_image_pk in local_causeandeffects[pk].images) {
                    var imageUrl = serverUrl + '/media/' + local_causeandeffects[pk].images[causeandeffect_image_pk].fields.image;
                    var imageItem = '<li><div style="background-size: cover; width: 200px; height: 200px; border: 0px solid #54bef9; padding: 0px; margin: 0px; background-image: url(\'' + imageUrl + '\');"></div></li>';
                    $('#selected-causeandeffect-images').append(imageItem);
                }
            } else {
                $('#causeandeffect-image-section').hide();
            }

            // Initialize iScroll element
            myScroll = new iScroll('causeandeffect-horizontalWrapper');

            // Hide all question elements
            // var options = {
            //     filter: ':not(.question):not(.causeandeffect)'
            // };
            // $('#container').isotope(options);

            // Open the container again, showing only cause-and-effects and investigations for the selected question
            $('#container').slideDown('slow');
        });

    });

    // Show cause and effect elements for selected question
    // TODO: Query database and some number of random CEs

    // Show investigation elements for selected question
    // TODO: Query database to get some number of random INVs
}

function loadCauseAndEffects(options) {
    options = (typeof options === "undefined") ? {} : options;

    // Construt URI
    var requestUri = serverUrl + "/sinq/api/causeandeffects/?format=json";
    if (options.question_id !== undefined) {
        requestUri = requestUri + "&question_id=" + options.question_id;
    }
    if (options.investigation_id !== undefined) {
        requestUri = requestUri + "&investigation_id=" + options.investigation_id;
    }


    $.ajax({
        type: "GET",
        url: requestUri,
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
            for (var i = 0, len = data.length; i < len; i++) {
                datum = data[i];

                // Create or update locally cached copy
                local_causeandeffects[datum.pk] = datum;
                if(!local_causeandeffects[datum.pk].hasOwnProperty('images')) {
                    local_causeandeffects[datum.pk].images = [];
                }

                item = '<div id="causeandeffect_' + datum.pk + '" class="causeandeffect causeandeffect-' + datum.pk + ' element feature  width2 height2" data-option-key="filter" data-option-value=".causeandeffect-' + datum.pk + '" data-date-created="' + datum.fields.date_created + '" data-date-last-modified="' + datum.fields.date_last_modified + '" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #28c565; background-image:url(\'\');">' +
                            '<a href="javascript:onCauseAndEffectClick(' + datum.pk + ');" data-option-value=".causeandeffect-' + datum.pk + '">' +
                            '<div id="causeandeffect-' + datum.pk + '-image" style="background-size: cover; width: 230px; height: 230px; border: 1px solid #30a382; padding: 0px; margin: 0px;">' +
                                    '<h2 class="cause">' + datum.fields.cause + '</h2>' +
                                    '<div style="background-color: #b1e583; width: 224px; top: 4.2em; left: 0.5em; margin: 0px -14px 0px -14px; border-right: 6px solid #ffffff; height: 10px;">' +
                                    '<img id="selected-causeandeffect-add-photo" src="./assets/img/noun_project_6344.svg" height="30" style="margin-top: -10px; margin-bottom: -15px; margin-left: 10px;" />' +
                                '</div>' +
                                '<h2 class="effect">' + datum.fields.effect + '</h2>' +
                            '</div>' +
                            '</a>' +
                        '</div>';

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
            for(var i = 0, len = item_ids.length; i < len; i++) {
                loadCauseAndEffectImages(item_ids[i]);
            }
        }
    });
}

/**
 * Retreive images for the cause-and-effect with the specified primary key.
 */
function loadCauseAndEffectImages(pk) {
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/api/causeandeffects/" + pk + "/images/?format=json",
       cache: false,
       success: function(responseData) {
            for(var i in responseData) {
                if (responseData.hasOwnProperty(i)) {
                    var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
                    // alert(imageUrl);
                    //$('#question_' + pk + '_image').attr('src', imageUrl); // Reset all contents
                    $('#causeandeffect-' + pk + '-image').css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
                    //$('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');

                    // Create or update locally cached copy
                    local_causeandeffects[pk].images[responseData[i].pk] = responseData[i];
                }
            }
        }
    });
}

function storeCauseAndEffect() {

    // alert("1");

    // Get form data
    //var question_id = $('#question_id').val();
    var cause_text  = $('#cause_text').val();
    var effect_text = $('#effect_text').val();

    // Validate form
    if(cause_text === '' || effect_text === '') {
        alert("You have to snap a photo and type a cause and effect.");
        return;
    }

    // Serialize data in JSON format
    var causeandeffect = {};

    // Get question pk if a question is selected and visible
    if( $('#selected-question-element').is(':visible') ) {
        causeandeffect.question_id = $('#selected-question-pk').val();
    }

    // Get question pk if a question is selected and visible
    if( $('#selected-investigation-element').is(':visible') ) {
        causeandeffect.investigation_id = $('#selected-investigation-pk').val();
    }

    causeandeffect.cause_text = cause_text;
    causeandeffect.effect_text = effect_text;

    var data = {}; // "Wrapper object" for cause-and-effect to be sent to server.
    data.causeandeffect = causeandeffect;

    var causeandeffect_json = JSON.stringify(data);

    // alert(causeandeffect_json);

    // Send serialized data to server
    // $.ajax({
    //     type: 'POST',
    //     url: serverUrl + "/sinq/api/causeandeffects/create/",
    //     data: causeandeffect_json,
    //     success: function(responseData) {

    //         alert("added : " + responseData[0].pk);

    //         // Attach cause-and-effect photo
    //         if ($("#cause-and-effect-photo").attr('src') !== '') {
    //             alert('Attaching photo to cause-and-effect ' + responseData[0].pk + '.');
    //             var causeandeffect_pk = parseInt(responseData[0].pk);
    //             storeCauseAndEffectImage(causeandeffect_pk);
    //         }
    //     },
    //     // error: function() {
    //     //     alert("error");
    //     // },
    //     // crossDomain: true,
    //     // dataType: 'json'
    // });

    // Send serialized data to server
    $.ajax({
        type: 'POST',
        url: serverUrl + "/sinq/api/causeandeffects/create/",
        data: causeandeffect_json,
        success: function(responseData) {

            // Attach photo to question
            if ($("#cause-and-effect-photo").attr('src') !== '') {
                // alert('Attaching photo to causeandeffect ' + responseData[0].pk + '.');
                var causeandeffect_pk = parseInt(responseData[0].pk, 10);
                storeCauseAndEffectImage(causeandeffect_pk);
            }

        }
        // dataType: 'json'
    });
}

function storeCauseAndEffectImage(causeandeffect_pk) {

    // alert("storeCauseAndEffectImage");

    // Upload the image to server
    function success(response) {
        // alert("success!");
        showDashboard();
    }
    
    function fail(error) {
        alert("There was a problem adding the photo (Error code " + error.code + ").");
    }

    // alert("a");
    
    var options2 = new FileUploadOptions();
    options2.fileKey = "causeandeffect_image"; // parameter name of file -- in POST data?
    options2.fileName = pictureUriCache.causeandeffect.substr(pictureUriCache.causeandeffect.lastIndexOf('/') + 1); // name of file
    options2.mimeType = "image/jpeg";

    // alert("b");
    
    var requestUri = serverUrl + '/sinq/api/causeandeffects/' + causeandeffect_pk + '/images/create/';
    // alert("c - " + pictureUriCache['causeandeffect'] + " { TO } " + requestUri);
    // cause_and_effect_photo.src = pictureUriCache['causeandeffect'];
    var ft2 = new FileTransfer();
    ft2.upload(pictureUriCache.causeandeffect, requestUri, success, fail, options2);

    // Reset image URI
    pictureUriCache.causeandeffect = '';
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
    // Get form data
    //var question_id = $('#question_id').val();
    var investigation_steps = [];

    var investigation_step_elements = $('#create-investigation-steps').children('.create-investigation-step');

    investigation_step_elements.each(function(index) {
        // alert( $(this).html() );
        var investigation_step = {};

        investigation_step.number = $(this).data('investigation-step-number');
        investigation_step.text = $('#investigation-step-' + investigation_step.number + '-text').val();

        // Push step onto array
        investigation_steps.push(investigation_step);
    });

    // Validate form
    // if($("#photo_preview").attr('src') == '' || cause_text == '' || effect_text == '') {
    //     alert("You have to snap a photo and type a cause and effect.");
    // }

    // Serialize data in JSON format
    var investigation = {};
    // if (question_id != '') {
    //     hypothesis.question_id = question_id;
    //     alert('has question id');
    // }
    investigation.steps = investigation_steps;

    // Get question pk if a question is selected and visible
    if( $('#selected-question-element').is(':visible') ) {
        investigation.question_id = $('#selected-question-pk').val();
    }

    // Get cause-and-effect pk if a cause-and-effect is selected and visible
    if( $('#selected-causeandeffect-element').is(':visible') ) {
        investigation.causeandeffect_id = $('#selected-causeandeffect-pk').val();
    }

    var data = {}; // "Wrapper object" for investigation to be sent to server.
    data.investigation = investigation;

    var investigation_json = JSON.stringify(data);

    //alert(hypothesis_json);

    // Send serialized data to server
    $.ajax({
        type: 'POST',
        url: serverUrl + "/sinq/api/investigations/create/",
        data: investigation_json,
        success: function(responseData) {
            // alert('pk: ' + responseData[0].pk);
            // var investigation_pk = parseInt(responseData[0].pk);
            // alert(investigation_pk);
            // addInvestigationImage(investigation_pk);
        }
        // dataType: 'json'
    });
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
    if(question_text === '') {
        showMessage("You have to snap a photo and type a question.");
    }

    // Serialize data in JSON format
    var question = {};
    question.text = question_text;

    // Get cause-and-effect pk if a cause-and-effect is selected and visible
    if( $('#selected-causeandeffect-element').is(':visible') ) {
        question.causeandeffect_id = $('#selected-causeandeffect-pk').val();
    }

    // Get question pk if a question is selected and visible
    if( $('#selected-investigation-element').is(':visible') ) {
        question.investigation_id = $('#selected-investigation-pk').val();
    }

    var data = {};
    data.question = question;

    var question_json = JSON.stringify(data);

    //alert(question_json);

    // Send serialized data to server
    $.ajax({
        type: 'POST',
        url: serverUrl + "/sinq/api/questions/create/",
        data: question_json,
        success: function(responseData) {

            // Attach photo to question
            if ($("#question-photo").attr('src') !== '') {
                // alert('Attaching photo to question ' + responseData[0].pk + '.');
                var question_pk = parseInt(responseData[0].pk, 10);
                storeQuestionImage(question_pk);
            }

        }
        // dataType: 'json'
    });
}

function storeQuestionImage(question_pk) {

    // Upload the image to server
    function success(response) {
        // alert("upload successful");
        // $.mobile.changePage( "./index.html" );
        // $.mobile.changePage( "./question_view.html?pk=" + question_pk);

        // response.responseCode
        // response.response
        // response.bytesSent

        // alert(response.responseCode + ': ' + response.response + ' (sent: ' + response.bytesSent + ')');
        // console.log('storeQuestionImage callback success: { responseCode: ' + response.responseCode + ', response: ' + response.response + ', bytesSent: ' + response.bytesSent + ', ' + '}');

        showDashboard();
    }
    
    function fail(error) {
        alert("Your photo could not be uploaded.  (Error " + error.code + ")");
    }


    
    var options = new FileUploadOptions();
    options.fileKey = "question_image"; // parameter name of file -- in POST data?
    options.fileName = pictureUriCache.question.substr(pictureUriCache.question.lastIndexOf('/') + 1); // name of file
    options.mimeType = "image/jpeg";

    // alert(pictureUriCache['question']);
    
    var requestUri = serverUrl + '/sinq/api/questions/' + question_pk + '/images/create/';
    // alert(requestUri);

    var ft = new FileTransfer();
    ft.upload(pictureUriCache.question, requestUri, success, fail, options);

    // Reset image URI
    pictureUriCache.question = '';
}

function loadQuestions(options) {
    options = (typeof options === "undefined") ? {} : options;

    // Construt URI
    var requestUri = serverUrl + "/sinq/api/questions/?format=json";
    if (options.causeandeffect_id !== undefined) {
        requestUri = requestUri + "&causeandeffect_id=" + options.causeandeffect_id;
    }
    if (options.investigation_id !== undefined) {
        requestUri = requestUri + "&investigation_id=" + options.investigation_id;
    }

    $.ajax({
        type: "GET",
        url: requestUri, //serverUrl + "/sinq/api/questions/?format=json",
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
                    local_questions[datum.pk].images = [];
                }

                // Create HTML element to show in Isotope container
                var item = '<div id="question_' + datum.pk + '" class="question question-' + datum.pk + ' element feature width2 height2" data-option-key="filter" data-date-created="' + datum.fields.date_created + '" data-date-last-modified="' + datum.fields.date_last_modified + '" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #0653f4; background-image:url(\'\');">' +
                            '<a href="javascript:onQuestionClick(' + datum.pk + ');" data-option-value=".question-' + datum.pk + '">' +
                            '<div id="question-' + datum.pk + '-image" style="background-size: cover; width: 230px; height: 230px; border: 0px solid #54bef9; padding: 0px; margin: 0px;">' +
                                '<h2 class="text">' +
                                    '<span style="color: white; /*font: normal 24px/45px Helvetica, Sans-Serif;*/ letter-spacing: 0px; background: rgb(0, 0, 0); /* fallback color */ background: rgba(0, 0, 0, 0.5); padding: 5px; margin: -15px -15px 0px -15px;">' +
                                        datum.fields.text +
                                    '</span>' +
                                '</h2>' +
                            '</div>' +
                            '</a>' +
                        '</div>';

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

            // Request images
            for(var i = 0   , len = item_ids.length; i < len; i++) {
                loadQuestionImages(item_ids[i]);
            }
        }
    });
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
               $('#question-' + pk + '-image').css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
               //$('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');

                // Create or update locally cached copy
                local_questions[pk].images[responseData[i].pk] = responseData[i];
           }
       }
    });
}

function loadInvestigations(options) {
    options = (typeof options === "undefined") ? {} : options;

    // Construt URI
    var requestUri = serverUrl + "/sinq/api/investigations/?format=json";
    if (options.question_id !== undefined) {
        requestUri = requestUri + "&question_id=" + options.question_id;
    }
    if (options.causeandeffect_id !== undefined) {
        requestUri = requestUri + "&causeandeffect_id=" + options.causeandeffect_id;
    }

    $.ajax({
        type: "GET",
        url: requestUri,
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

            local_investigations = [];

            // Create HTML markup for retreived questions and add to a list
            for ( var i=0, len = data.length; i < len; i++ ) {
                datum = data[i];

                // Create or update locally cached copy
                // TODO: Move this.  Create function to give complete, empty datastructure (local and remote versions).
                local_investigations[datum.pk] = datum;
                if(!local_investigations[datum.pk].hasOwnProperty('steps')) {
                    local_investigations[datum.pk].steps = [];
                }

                // Create HTML element to show in Isotope container
                var item = '<div id="investigation_' + datum.pk + '" class="investigation investigation-' + datum.pk + ' element feature width2 height2" data-option-key="filter" data-date-created="' + datum.fields.date_created + '" data-date-last-modified="' + datum.fields.date_last_modified + '" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #c2314e; background-image:url(\'\');">' +
                            '<a href="javascript:onInvestigationClick(' + datum.pk + ');" data-option-value=".investigation-' + datum.pk + '">' +
                            '<div id="investigation-' + datum.pk + '-image" style="background-size: cover; width: 230px; height: 230px; border: 0px solid #54bef9; padding: 0px; margin: 0px;">' +
                                // + '<h2 class="text">' + datum.fields.text + '</h2>'
                            '</div>' +
                            '</a>' +
                        '</div>';

                items.push( item );
                item_ids.push( datum.pk );
            }

            // Add class to queestion markup
            var $items = $( items.join('') ).addClass('investigation');

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

            // Request steps
            for(var i = 0   , len = item_ids.length; i < len; i++) {
                loadInvestigationSteps(item_ids[i]);
            }
        }
    });
}

function loadInvestigationSteps(investigation_pk) {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/api/investigations/" + investigation_pk + "/steps/?format=json",
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

           // var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
           // $('#question-' + pk + '-image').css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
           // local_questions[pk]['images'][responseData[i].pk] = responseData[i];

            // Create HTML markup for retreived questions and add to a list
            var stepPreviewMax = 3;
            var remainingStepCount = 0;
            var len;
            for ( var i=0, len = data.length; i < len; i++ ) {
                datum = data[i];

                var item
                    = '<h1>' + datum.fields.number + '. ' + datum.fields.text + '</h1>';
                if (i < (len - 1)) {
                    item = item + '<div class="spacer">&nbsp;</div>';
                }

                // Create or update locally cached copy
                local_investigations[investigation_pk].steps[datum.pk] = datum;
                // alert(data[i].fields.number);

                // Create HTML element to show in Isotope container
                // $('#question-' + pk + '-image').css('background-image', 'url(' + imageUrl + ')'); // Reset all contents

                if (i < stepPreviewMax) {
                    var stepItem
                        = '<div style="position: relative;"><h2 style="position: relative; padding: 5px;">' + datum.fields.text + '</h2></div>' +
                          '<div style="position: relative; background-color: #fb6e69; width: 224px; /*top: 4.2em;*/ left: 0.5em; margin: 0px -14px 0px -13px; border-right: 6px solid #ffffff; height: 10px;">&nbsp;</div>';
                    // $('#investigation-' + investigation_pk + '-image').append('' + datum.fields.number + '. ~~<br />');
                    $('#investigation-' + investigation_pk + '-image').append(stepItem);
                    // $('#selected-investigation-steps').append(item);
                }
            }

            remainingStepCount = len - stepPreviewMax;
            if (remainingStepCount > 0) {
                var stepItem
                        = '<div style="position: relative;"><h2 style="position: relative; padding: 5px;">...' + remainingStepCount + ' more steps</h2></div>';
                        // + '<div style="position: relative; background-color: #fb6e69; width: 224px; /*top: 4.2em;*/ left: 0.5em; margin: 0px -14px 0px -13px; border-right: 6px solid #ffffff; height: 10px;">&nbsp;</div>'
                    // $('#investigation-' + investigation_pk + '-image').append('' + datum.fields.number + '. ~~<br />');
                    $('#investigation-' + investigation_pk + '-image').append(stepItem);
            }

            // Add class to queestion markup
            // var $items = $( items.join('') ).addClass('investigation');

            // set random number for each item
            // $items.each(function() {
            //     $(this).attr('data-number', ~~( Math.random() * 100 + 15 ));
            // });

            // Load images for investigation's steps
            // for(var i = 0   , len = item_ids.length; i < len; i++) {
            //     loadQuestionImages(item_ids[i]);
            // }
        }
    });
}

function showDashboard() {
    hideSections();

    $("#container").isotope('remove', $('#container').find('.element'));

    loadQuestions();
    loadCauseAndEffects();
    loadInvestigations();

   // Hide all question elements
    // var options = {
    //     filter: '*'
    // };
    // $('#container').isotope({ 'filter': '*' });

    // Open the container again, showing only cause-and-effects and investigations for the selected question
    $('#container').slideDown('slow');

    // Hide the footer
    // slideUpFooter();
}

function slideUpFooter() {
    $('#footer').slideUp('slow');

    $('#footer-done-button').unbind('click');
}

function hideSections() {
    // $('#container').slideUp('fast');

    $('#selected-question-element').slideUp('fast');
    $('#selected-causeandeffect-element').slideUp('fast');
    $('#selected-investigation-element').slideUp('fast');

    $('#create-question-section').slideUp('fast');
    $('#create-causeandeffect-section').slideUp('fast');
    $('#create-investigation-section').slideUp('fast');
}

function resetCreateQuestionForm() {
    // if( $('#selected-causeandeffect-element').is(':visible') ) {

    // HACK: Reconstruct form. This is a hack becuase I can't find a way to cleanly re-initialize the element.  The following DO NOT work.
    // $('#input_text').attr('val', undefined); // Reset question text
    // $('#input_text').attr('placeholder', 'Touch this box to type your question.'); // Reset jQuery Mobile "placleholder" attribute
    $('#question_text').remove();
    $('#question_text_fieldcontain').append('<input id="question_text" name="question_text" type="text" placeholder="Touch this box to type your question." style="font-size: 18pt;" />');
    $('#question_text').textinput();

    // }
}

function resetCreateCauseAndEffectForm() {

    // HACK: Reconstruct form. This is a hack becuase I can't find a way to cleanly re-initialize the element.  The following DO NOT work.
    // $('#input_text').attr('val', undefined); // Reset question text
    // $('#input_text').attr('placeholder', 'Touch this box to type your question.'); // Reset jQuery Mobile "placleholder" attribute
    $('#cause_text').remove();
    $('#cause_text_fieldcontain').append('<input id="cause_text" name="cause_text" type="text" placeholder="Touch this box to type the cause." style="font-size: 18pt;" />');
    $('#cause_text').textinput();

    $('#effect_text').remove();
    $('#effect_text_fieldcontain').append('<input id="effect_text" name="effect_text" type="text" placeholder="Touch this box to type the effect." style="font-size: 18pt;" />');
    $('#effect_text').textinput();

    $('#cause-and-effect-photo').attr('src', ''); // Reset question photo
}

function resetCreateInvestigationForm() {
    // Reset investigation step counter
    create_investigation_step_counter = 1;

    // Remove all steps
    $("#create-investigation-steps").html('');
}

function onQuestionClick(pk) {

    // Add question to top (expand it)
    // Remove all questions from container
    // Filter out everything that isn't associated with the current question

    // local_questions[datum.pk].pk;
    // local_questions[datum.pk].fields.text;

    // Populate element
    $('#selected-question-pk').val(local_questions[pk].pk);
    $('#selected-question-text').html(local_questions[pk].fields.text);

    // Hide sections after question section
    // $('#container').slideUp('slow');

    $('#selected-causeandeffect-element').slideUp('slow');
    $('#selected-investigation-element').slideUp('slow');

    $('#create-question-section').slideUp('slow');
    $('#create-causeandeffect-section').slideUp('slow');
    $('#create-investigation-section').slideUp('slow');

    // Reset form element
    resetCreateQuestionForm();

    // Get number of cause and effect
    // Get number of investigations

    $("#container").isotope('remove', $('#container').find('.element'));

    // Set options for selected elements
    var options = {};

    options.question_id = pk;

    if( $('#selected-causeandeffect-element').is(':visible') ) {
        options.causeandeffect_id = $('#selected-causeandeffect-pk').val();
    }
    
    if( $('#selected-investigation-element').is(':visible') ) {
        options.investigation_id = $('#selected-investigation-pk').val();
    }

    loadCauseAndEffects(options);
    loadInvestigations(options);

    $('#container').slideUp('fast', function() {

        $('#selected-question-element').slideDown('slow', function() {

            // Add photos to scroller
            $('#selected-question-images').html('');
            var questionImages = local_questions[pk].images;
            if(questionImages.length > 0) {
                $('#question-image-section').show();
                for (question_image_pk in questionImages) {
                    var imageUrl = serverUrl + '/media/' + questionImages[question_image_pk].fields.image;
                    var imageItem = '<li><div style="background-size: cover; width: 200px; height: 200px; border: 0px solid #54bef9; padding: 0px; margin: 0px; background-image: url(\'' + imageUrl + '\');"></div></li>';
                    $('#selected-question-images').append(imageItem);
                }
            } else {
                $('#question-image-section').hide();
            }

            // Initialize iScroll element
            myScroll = new iScroll('question-horizontalWrapper');

            // Remove elements from container
            // $("#container").isotope('remove', $('#container').find('.element'));
            // // $("#container").isotope('remove', $('#container').find('.element'));
            // loadCauseAndEffects({ 'question_id': pk });

            // // Hide all question elements
            // var options = {
            //     filter: ':not(.question)'
            // };
            // $('#container').isotope(options);

            // // Open the container again, showing only cause-and-effects and investigations for the selected question
            $('#container').slideDown('slow');
        });

    });

    // Show cause and effect elements for selected question
    // TODO: Query database and some number of random CEs

    // Show investigation elements for selected question
    // TODO: Query database to get some number of random INVs
}

function getObjectLength (o) {
  var length = 0;

  for (var i in o) {
    if (Object.prototype.hasOwnProperty.call(o, i)){
      length++;
    }
  }
  return length;
}

function onInvestigationClick(pk) {

    // Add question to top (expand it)
    // Remove all questions from container
    // Filter out everything that isn't associated with the current question

    // local_questions[datum.pk].pk;
    // local_questions[datum.pk].fields.text;

    //$('#selected-question-text').html(local_investigations[pk].fields.text);

    // Populate element
    $('#selected-investigation-pk').val(local_investigations[pk].pk);

    // Hide sections after investigation section
    // $('#container').slideUp('slow');

    // $('#selected-question-element').slideUp('slow');
    // $('#selected-causeandeffect-element').slideUp('slow');

    $('#create-question-section').slideUp('slow');
    $('#create-causeandeffect-section').slideUp('slow');
    $('#create-investigation-section').slideUp('slow');

    // Reset form element
    //resetCreateQuestionForm();

    // Get number of cause and effect
    // Get number of investigations

    $("#container").isotope('remove', $('#container').find('.element'));

    // Set options for selected elements
    var options = {};

    options.investigation_id = pk;
    
    if( $('#selected-question-element').is(':visible') ) {
        options.question_id = $('#selected-question-pk').val();
    }

    if( $('#selected-causeandeffect-element').is(':visible') ) {
        options.causeandeffect_id = $('#selected-causeandeffect-pk').val();
    }

    loadQuestions(options);
    loadCauseAndEffects(options);

    $('#container').slideUp('fast', function() {

        $('#selected-investigation-element').slideDown('slow', function() {

            // Create HTML markup for retreived questions and add to a list
            var investigationSteps = local_investigations[pk].steps;
            var i = 0;
            var len = getObjectLength(investigationSteps);
            // var len = investigationSteps.length;
            for (investigation_step_pk in investigationSteps) {
            // for ( var i=0, len = investigationSteps.length; i < len; i++ ) {
                datum = investigationSteps[investigation_step_pk];

                var item
                    = '<h1>' + datum.fields.number + '. ' + datum.fields.text + '</h1>';
                if (i < (len - 1)) {
                    item = item + '<div class="spacer">&nbsp;</div>';
                }

                // Create HTML element to show in Isotope container
                // $('#question-' + pk + '-image').css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
                $('#selected-investigation-steps').append(item);

                i++;
            }

            // Open the container again, showing only cause-and-effects and investigations for the selected investigation
            $('#container').slideDown('slow');
        });

    });

    // Show cause and effect elements for selected question
    // TODO: Query database and some number of random CEs

    // Show investigation elements for selected question
    // TODO: Query database to get some number of random INVs
}