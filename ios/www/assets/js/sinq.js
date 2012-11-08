// SINQ server URL
var serverUrl = 'http://10.10.0.141';
//var serverUrl = 'http://10.109.94.103'; // 129.2.129.39
//var serverUrl = 'http://129.2.101.49';
/*
 if (location.host == 'localhost') {
 // code for local version goes here
 serverUrl = 'http://localhost';
 } else {
 // code for online version goes here
 serverUrl = 'http://129.2.101.49';
 }
 */

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var currentQuestionPk = null;

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
//
function onDeviceReady() {
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
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

var lastImageURI = null;

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
    
    // // Upload the image to server
    // function success(response) {
    //     alert("upload successful");
    // }
    
    // function fail(error) {
    //     alert("upload failed: " + error.code);
    // }
    
    // var options = new FileUploadOptions();
    // options.fileKey = "question_image"; // parameter name of file -- in POST data?
    // options.fileName = lastImageURI.substr(lastImageURI.lastIndexOf('/') + 1); // name of file
    // options.mimeType = "image/jpeg";
    
    // var ft = new FileTransfer();
    // //ft.upload(lastImageURI, serverUrl + '/sinq/questions/' + currentQuestionPk + '/images/create/', success, fail, options);
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
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
                                destinationType: navigator.camera.DestinationType.FILE_URI });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
                                destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
                                destinationType: destinationType.FILE_URI,
                                sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('Failed because: ' + message);
}

//  _    _                   _   _                         
// | |  | |                 | | | |                        
// | |__| |_   _ _ __   ___ | |_| |__   ___  ___  ___  ___ 
// |  __  | | | | '_ \ / _ \| __| '_ \ / _ \/ __|/ _ \/ __|
// | |  | | |_| | |_) | (_) | |_| | | |  __/\__ \  __/\__ \
// |_|  |_|\__, | .__/ \___/ \__|_| |_|\___||___/\___||___/
//          __/ | |                                        
//         |___/|_|                                        

function getHypotheses() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/hypotheses/?format=json",
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
                // item = '<li><a href="' + datum.url + '">'
                //     + '<img src="' + datum.image.replace('/l.', '/m.') + '" />'
                //     + '<b>' + datum.title + '</b>'
                //     + '</a></li>';

                // var item = '<li><a href="./question_view.html?pk=' + dataum.pk + '">'
                //     + '<img id="question_' + datum.pk + '_image" width="100" height="100" />'
                //     + '<h3>' + dataum.fields.text + '</h3>'
                //     + '</a></li>';

                var item = '<div id="hypothesis_' + datum.pk + '" class="hypothesis element feature  width2 height2 alkaline-earth metal" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #fff84d; background-image:url(\'\');">'
                            + '<a href="./hypothesis_view.html?pk=' + datum.pk + '">'
                            + '<div style="width: 230px; height: 230px;">'
                                + '<h2 class="cause">' + datum.fields.cause + '</h2>'
                                + '<h2 class="effect">' + datum.fields.effect + '</h2>'
                            + '</div>'
                            + '</a>'
                        + '</div>';

                items.push( item );
                item_ids.push( datum.pk );
            }

            // Add class to queestion markup
            var $items = $( items.join('') ).addClass('hypothesis');

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
                getHypothesisImages(item_ids[i]);
            }
        }
    });
}

function getHypothesisImages(pk) {
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/hypotheses/" + pk + "/images/?format=json",
       //            data: ({name: theName}),
       //            cache: false,
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

function addHypothesis() {

    // Get form data
    var cause_text = $('#cause_text').val();
    var effect_text = $('#effect_text').val();

    // Validate form
    if($("#photo_preview").attr('src') == '' || cause_text == '' || effect_text == '') {
        alert("You have to snap a photo and type a cause and effect.");
    }

    // Serialize data in JSON format
    var hypothesis = new Object();
    hypothesis.cause_text = cause_text;
    hypothesis.effect_text = effect_text;

    var data = new Object();
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
        // $.mobile.changePage( "./question_view.html?pk=" + hypothesis_pk);
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

// function addHypothesisImage(hypothesis_pk) {

//     // Upload the image to server
//     function success(response) {
//         alert('Success: ' + response);
//         // alert("upload successful");
//         // $.mobile.changePage( "./index.html" );
//         $.mobile.changePage( "./hypothesis_view.html?pk=" + hypothesis_pk);
//     }
    
//     function fail(error) {
//         alert("Your photo could not be saved.  (Error code " + error.code + ")");
//     }
    
//     // Configure file upload options
//     var options      = new FileUploadOptions();
//     options.fileKey  = "hypothesis_image"; // Name of form element (used by server to access file in POST data).
//     options.fileName = lastImageURI.substr(lastImageURI.lastIndexOf('/') + 1); // File name (not full path, just the file)
//     options.mimeType = "image/jpeg";
    
//     // Set up file transfer and upload the file
//     var ft = new FileTransfer();
//     var requestUrl = serverUrl + '/sinq/api/hypotheses/' + hypothesis_pk + '/images/create/';
//     ft.upload(lastImageURI, requestUrl, success, fail, options);

//     // Reset image URI
//     //lastImageURI = null;
// }

//   ____                  _   _                 
//  / __ \                | | (_)                
// | |  | |_   _  ___  ___| |_ _  ___  _ __  ___ 
// | |  | | | | |/ _ \/ __| __| |/ _ \| '_ \/ __|
// | |__| | |_| |  __/\__ \ |_| | (_) | | | \__ \
//  \___\_\\__,_|\___||___/\__|_|\___/|_| |_|___/

function addQuestion() {

    // Get form data
    var question_text = $('#question_text').val();

    // Validate form
    if($("#photo_preview").attr('src') == '' || question_text == '') {
        alert("You have to snap a photo and type a question.");
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
            var question_image_pk = parseInt(responseData[0].pk)
            addQuestionImage(question_image_pk);
        }
        // dataType: 'json'
    });
}

function addQuestionImage(question_pk) {

    // Upload the image to server
    function success(response) {
        // alert("upload successful");
        // $.mobile.changePage( "./index.html" );
        $.mobile.changePage( "./question_view.html?pk=" + question_pk);
    }
    
    function fail(error) {
        alert("upload failed: " + error.code);
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

function getQuestions() {
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

                // Create HTML element to show in Isotope container
                var item = '<div id="question_' + datum.pk + '" class="question element feature  width2 height2 alkaline-earth metal" data-symbol="Mg" data-category="alkaline-earth" style="background-color: #fff84d; background-image:url(\'\');">'
                            + '<a href="./question_view.html?pk=' + datum.pk + '">'
                            + '<div style="width: 230px; height: 230px;">'
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

            // Request images
            for(var i = 0   , len = item_ids.length; i < len; i++) {
                getQuestionImages(item_ids[i]);
            }
        }
    });
}

function getQuestions2() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/questions/?format=json",
        //            data: ({name: theName}),
        //            cache: false,
        success: function(responseData) {
            //              alert(JSON.parse(responseData));
            $("#questions_listview").html('');
            for(i in responseData) {
                //var item = '<li><a href="#question" onclick="openQuestion(' + responseData[i].pk + ');">' + responseData[i].fields.text + '</a></li>';
                //var item = '<li><a href="./question_view.html?pk=' + responseData[i].pk + '" data-icon="arrow-r">' + responseData[i].fields.text + '</a></li>';
                var item = '<li><a href="./question_view.html?pk=' + responseData[i].pk + '">'
                    + '<img id="question_' + responseData[i].pk + '_image" width="100" height="100" />'
                    + '<h3>' + responseData[i].fields.text + '</h3>'
                    // + '<p>Ask your questions.</p>'
                    + '</a></li>';
                $('#questions_listview').append(item).listview('refresh');

                // Get thumbnail image
                getQuestionImages(responseData[i].pk);
            }
            $('#questions_listview').listview('refresh');
        }
    });
}

function getQuestionImages(pk) {
    $.ajax({
       type: "GET",
       url: serverUrl + "/sinq/questions/" + pk + "/images/?format=json",
       //            data: ({name: theName}),
       //            cache: false,
       success: function(responseData) {
           for(i in responseData) {
               var imageUrl = serverUrl + '/media/' + responseData[i].fields.image;
               // alert(imageUrl);
               //$('#question_' + pk + '_image').attr('src', imageUrl); // Reset all contents
               $('#question_' + pk).css('background-image', 'url(' + imageUrl + ')'); // Reset all contents
               //$('#question_images').append('<img src="' + imageUrl + '" width="320" height="240" />');
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