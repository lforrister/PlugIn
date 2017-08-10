var config = {
    apiKey: "AIzaSyB9Hj6Bm5lilQjXZ37fknYOllzxeTIg7UI",
    authDomain: "plugin-1e36a.firebaseapp.com",
    databaseURL: "https://plugin-1e36a.firebaseio.com",
    projectId: "plugin-1e36a",
    storageBucket: "",
    messagingSenderId: "448145345519"
  };
  firebase.initializeApp(config);


var dataRef = firebase.database();

var person = {
    name : "",
    email : 0,
    phone : 0,
    city :"",
    events :""
};

var event = {
    id : 0,
    latitude:0,
    longtitude:0
};

var customEvent = {
    artist : "",
    venue : "",
    date : ""
};
var personkey = "";
var latitude = 0;
var longtitude = 0;
var theResult ="";

//========================== Retriving Data From DataBase ====================





//============================= SignUp Function =============================
$("#signUpButton").on("click", function() {
    $("#signUpButton").hide();
    $("#signUpForm").css("opacity", "1");
});

$("#submit").on("click", function(event) {
    event.preventDefault();
     
    person.name = $("#nameInput").val().trim();
    person.email = $("#emailInput").val().trim();
    person.phone = $("#phoneNumberInput").val().trim();
    person.city = $("#cityInput").val().trim();
    
    dataRef.ref().child("persons").push({
        name:   person.name,
        email:  person.email,
        phone:  person.phone,
        city:   person.city,
        event:  ""
    }); //-----CLOSE PUSH ----
    
    location.href = "search.html";
   // window.location.href = "index.html";
});//-----CLOSE SUBMIT -------

var addedPerson = dataRef.ref("persons/");
    addedPerson.on("child_added", function(data){
    personkey = data.key; 
});
    
//============================== Client Event Input ==========================

$("#customEvent-submitButton").on("click", function(event){
    event.preventDefault();
  
    customEvent.artist = $("#clientEvent-artist-input").val().trim();
    customEvent.venue = $("#clientEvent-venue-input").val().trim();
    customEvent.date = $("#clientEvent-date-input").val().trim();
    
    dataRef.ref().child("customEvent").push({
        artist : customEvent.artist ,
        venue : customEvent.venue ,
        date : customEvent.date 
    }); //-----CLOSE PUSH ----
    $(".form-control").val("");
});//-----CLOSE SUBMIT -------

//============================= Search for Event (Eventful Api) ================

$("#eventSearch-submit-Btn").on("click", function(event){
    event.preventDefault();

    var venue = $("#venue-input").val().trim();
    var category = $("#category-input").val().trim();
    var distance = $("#radious-input").val().trim();
    var date = $("#select").val().trim();
    $(".event-search").hide();
    $("#findHead").text("TOP RESULTS");
//================================ search result page change ================
    var articleCounter = 0;
    var results = 0;
    var resultSize = 0;
    var resultPage = 0;
    var floor = 0;
    $("#well-section").empty();

     var apiKey = "tpx4FM5B5ftptgTf";
     var queryURL = "https://api.eventful.com/json/events/search";
    
     queryURL += '?' + $.param ({
        'app_key': apiKey,
        'q': category,
        'location': venue,
        'within': distance,
        'date':  date,
        'page_size': 200,
        'sort_order': "relevance"
     });

     $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "jsonp" 
     }).done(function(response) {
         
            results = response.events;
            theResult = results;
            resultPage = Math.ceil(results.event.length/10);
            resultSize = results.event.length;
            
//=================== Populating Page with resultDisplay function 
         
            resultDisplay(results, floor);
         
//===================== providing Event Page Selector Btns at the end of the dispaly section 
         
            if(resultSize > 10){
                for(var i = 1 ; i <= resultPage ; i++){
                    var btnSection = $("<button>");
                    btnSection.addClass("btn btn-default btnG");
                    btnSection.attr("id", "btn-" + i);
                    btnSection.attr("type", "radio");
                    btnSection.attr("autocomplete", "off");
                    btnSection.val(i);
                    btnSection.text(i);
                    $(".btn-group").append(btnSection);
                }
            }
//===================== Event Page Selector Btns Behavior ===================
         
            $(document).on("click", ".btnG", function() {
                for(var i = 1; i <= resultPage; i++){
                    $(".btnG").removeClass("active");
                }
                    $(this).addClass("active");
                    var ceilIndex = $(this).val();
                    floor = (ceilIndex*10)-10;
                    console.log(floor);
                    $("#well-section").empty();
                    resultDisplay(results, floor);
                });
        });
});

//===================== Select Event Button Function =============

$(document).on("click", "#selectEventBtn", function() {
    console.log($(this).val());
    var eventCounter = $(this).val();
    addEvent(theResult, eventCounter);
    location.href = "event.html"; 
    
});
//===================== Adding event to FireBase Data Function ====
function addEvent(theResult, eventCounter){
    
    var upd = dataRef.ref().child("persons/"+personkey);
    upd.update({
        "event" : theResult.event[eventCounter]
    });
    console.log(upd);
}  
//===================== Result Display ============================

function resultDisplay(results, floor){

    
    var ceil = floor+9;

    console.log(results);
    console.log(results.event[0].postal_code);         
    console.log(results.event[0].title);

    if(results.event.length < 10){
        ceil = results.event.length; 
    }
    if(results.event.length < ceil){
        ceil = results.event.length;
    }

    for(var i = floor ; i < ceil ; i++){
        articleCounter=i;
        if(results.event[i].title !== null){
            var title = results.event[i].title;
        }else{
            var title = "No Title";
        }
        if(results.event[i].image !== null){
            var images = results.event[i].image.medium.url;
        }else{
            var images = "assets/images/defaultEvent1.png";
        }
        if(results.event[i].venue_name !== null){
            var locationName = results.event[i].venue_name;
        }else{
            locationName="";
        }
        if(results.event[i].city_name !== null){
            var locationCity = results.event[i].city_name;
        }else{
            locationCity="";
        }
        if(results.event[i].postal_code !== null){
            var locationZipCode = results.event[i].postal_code;
        }else{
            locationZipCode ="";
        }
        if(results.event[i].region_name !== null){
            var locationRegion = results.event[i].region_name;
        }else{
            locationRegion ="";
        }
        var location = "<div>Location : <br>"+locationName+"<br>"+locationCity+", "+locationRegion+locationZipCode+"</div>";

        if(results.event[i].latitude !== null && results.event[i].longitude !== null){
            var lat = results.event[i].latitude;
            var long = results.event[i].longitude;
//            console.log(lat);
//            console.log(long);
        }else{
            lat = "";
            long = "";
        }  
        if(results.event[i].start_time !== null){
            var dateTime = results.event[i].start_time; 
        }else{
            dateTime = "";
        }
        if(results.event[i].url !== null){
            var websiteUrl = "<div class='eventFull'><a href='"+results.event[i].url+"' target='_blank'>More Information <br>& Buy Tickets</a><div>";
        }else{
            var websiteUrl = "";
        }   
        if(results.event[i].description !== null){
            var description = results.event[i].description;
        }else{
            var description = "No Data Is Available";
        }
        var wellSection = $("<div>");
        wellSection.addClass("well col-xs-12");
        wellSection.attr("id", "article-well-" + articleCounter);
        $("#well-section").append(wellSection);   
        $("#article-well-" + articleCounter).append("<div class='test col-xs-12'><h4>"+title+"</h4></div>"); 
        if(results.event[i].image !== null){
            $("#article-well-" + articleCounter).append("<div class='imageHolder col-xs-6 col-sm-4'><img src='"+images+"'></div>"); 
        }else{
            $("#article-well-" + articleCounter).append("<div class='imageHolder col-xs-6 col-sm-4'><img height = 128px width=128px src="+images+"></div>");
        } 
        $("#article-well-" + articleCounter).append("<div class='locationHolder col-xs-6 col-sm-4'>"+location+"</div>");
        $("#article-well-" + articleCounter).append("<div class='dateHolder col-xs-6 col-sm-4'>Date & Time : <br>"+dateTime+"</div>");
        $("#article-well-" + articleCounter).append("<div class='linkHolder col-xs-6 col-sm-8'>"+websiteUrl+"</div>");    
        $("#article-well-" + articleCounter).append("<div class='selectEvent col-xs-6 col-sm-12'><button class='btn btn-default' id='selectEventBtn' value='"+articleCounter+"' type='button'>Select This Event</button><div>"); 
        $("#article-well-" + articleCounter).append("<div class='descriptionHolder col-xs-12'><strong>Description :</strong> <br>"+description+"</button><div>"); 
    }
}
//===================== MAP =======================================

 var find = dataRef.ref().child("persons/"+personkey);
// find.ref().on("child_added", function(childSnapshot){
    find.on("child_added", function(childSnapshot){
    console.log(childSnapshot.val().event.latitude);
    console.log(childSnapshot.val().event.longitude);
    console.log(childSnapshot.val().event.title);
    console.log(childSnapshot.val().event.venue_name);
    console.log(childSnapshot.val().event.description);
    console.log(childSnapshot.val().event.url);

    latVal = childSnapshot.val().event.latitude;
    longVal = childSnapshot.val().event.longitude;
    title = childSnapshot.val().event.title;
    venueName = childSnapshot.val().event.venue_name;
    description = childSnapshot.val().event.description;
    url = childSnapshot.val().event.url;
   

 

    function initMap() {
        var latitude = parseFloat(latVal)
        console.log(latitude);
        var longitude = parseFloat(longVal)
        console.log(longitude);
    var uluru = {lat:latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
    position: uluru,
    map: map
    });
}

    // Display Into .event-select-display

    $(".event-select-display").html("<h2>" + title + "</h2>" + "<h4>" + venueName + "</h4>"
       + "<img src='assets/images/defaultImg2.png' width=70%> <br> <br> " + "<p>" + description + "</p> "
       +"<a href='" + url + "'> MORE INFO </a>");





initMap();
    
});









//===================== 

