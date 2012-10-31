// SINQ server URL
var serverUrl = 'http://10.10.0.141';
var serverUrl = 'http://10.109.94.103'; // 129.2.129.39
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
document.addEventListener("deviceready",onDeviceReady,false);

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
    var largeImage = document.getElementById('largeImage');
    
    // Unhide image elements
    //
    largeImage.style.display = 'block';
    
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
    
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

function addQuestion() {

    // Get form data
    var question_text = $('#question_text').val();

    // Validate form
    if($("#largeImage").attr('src') == '' || question_text == '') {
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

    // return;

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
    // currentQuestionPk = 1;
    // //ft.upload(lastImageURI, serverUrl + '/sinq/api/questions/' + currentQuestionPk + '/images/create/', success, fail, options);

    // $.mobile.changePage( "./index.html", { transition: "slideup"} );
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


function getQuestions() {
    $.ajax({
        type: "GET",
        url: serverUrl + "/sinq/questions/?format=json",
        //            data: ({name: theName}),
        //            cache: false,
        success: function(responseData) {
            //            	alert(JSON.parse(responseData));
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
               $('#question_' + pk + '_image').attr('src', imageUrl); // Reset all contents
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