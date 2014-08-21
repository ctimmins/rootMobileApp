/*  js/app.js  */
//console.log("loaded app.js");
var handler = 'http://farmperfect.com/libs/php/manager.php';
var thisApp;

$(document).on('deviceready', function(){
    console.log("deviceready");

    $(document).on('mobileinit', function(){
        console.log("jqm has been loaded");
        $.support.cors = true;
        $.mobile.allowCrossDomainPages = true; 
        
        app.initialize();
    });
    
    //load jquery mobile after 'mobileinit' listener is attached 
    //$('body').append('<script type="text/javascript" src="js/lib/jquery/jquery.mobile-1.4.3.min.js"></script>');
    $.getScript("js/lib/jquery/jquery.mobile-1.4.3.min.js");
    

});

var app = {

    initialize: function(){
        thisApp = this;
        
        //retrieve user credentials from local storage and try login
        var email = window.localStorage.getItem("Email");
        var pass = window.localStorage.getItem("Password");
        if(email != null && pass != null) {
            thisApp.login(email, pass);
        }
        else{
            //show login screen
            $(':mobile-pagecontainer').pagecontainer("change", "templates/login.html");
            //bind event to login button
            $('#login_button').on("click", function(){
                    var  email = $('#email').val();
                    var pass = $('#pass').val();
                    thisApp.login(email, pass);
            });
        }

        //log current page 
        $(document).on("pagecontainerbeforeshow", function(event, data){
            var pageId = $('body').pagecontainer('getActivePage').attr('id');
            console.log("current page: " + pageId);
        });

       
  
    },

    login: function(email, pass){
        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){
            if(returnVal != "Fail"){
                //store user credentials upon successful login
                window.localStorage.setItem("Email", email);
                window.localStorage.setItem("Password", pass);
                
                //prepend nav panel on each page load.  only triggered once
                $(document).one("pagecontainerbeforechange", function(e, ui){
                    console.log("appending navpanel");
                    $.get('templates/navpanel.html', function(template){
                        var panel = template;
                        $.mobile.pageContainer.prepend(panel);
                        $('#navpanel').panel();
                        //bind renderAccount event to account_button
                        $('#account_button').click(function(){
                            thisApp.renderAccount(returnVal);
                        });
                    });

                });
                
                //change page to dashboard
                $(':mobile-pagecontainer').pagecontainer("change", "templates/dashboard.html");


            }
            else{
                $(':mobile-pagecontainer').pagecontainer("change", "templates/login.html");
                 //bind click event to login
                $('#login_button').on("click", function(){
                    var  email = $('#email').val();
                    var pass = $('#pass').val();
                    thisApp.login(email, pass);
                });
            }
        });    
    },

    renderHomeView: function(){
        console.log("rendering home view");
        $(document).ready(function(){
            // $.get('templates/homeTemplate.html', function(template){
            //     //$('#home').css("background", "url(./img/root-background-4.jpg)")
            //     $('#home').html(template).trigger("create");
            // });        

        });
        
    },

    renderMapView: function(){
        console.log("rendering map view");

        // function onMapLoad() { 
        //     console.log("got to onLoad");
        //     if (1) {
        //         // load the google api
        //         var fileref=document.createElement('script'); 
        //         fileref.setAttribute("type","text/javascript"); 
        //         fileref.setAttribute("src",
        //             "http://maps.googleapis.com/maps/api/js?sensor=true&callback=" + "getGeolocation");
        //         document.getElementsByTagName("head")[0]. appendChild(fileref);
        //     } 
        //     else {
        //         alert("Must be connected to the Internet");
        //     } 
        // };

        // function getGeolocation() {
        //     // get the user's gps coordinates and display map
        //     console.log("got to getGeolocation"); 
        //     var options = {
        //         maximumAge: 3000, 
        //         timeout: 5000, 
        //         enableHighAccuracy: true
        //     }; 
        //     navigator.geolocation.getCurrentPosition(loadMap, geoError, options);
        // };

        // function loadMap(position) {
        //     console.log("got to loadMap");
        //     var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //     var myOptions = { 
        //         zoom: 8,
        //         center: latlng,
        //         mapTypeId: google.maps.MapTypeId.ROADMAP
        //     };
        //     var mapObj = $('#map_canvas');
        //     var map = new google.maps.Map(mapObj[0], myOptions);

        //     var marker = new google.maps.Marker({
        //         position: latlng,
        //         map: map,
        //         title: "You"
        //     });
                
        // };

        // function geoError(error){
        //     alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        // };
    },

    isLoggedIn: function(){
        //retrieve stored user credentials
        var email = window.localStorage.getItem("Email");
        var pass = window.localStorage.getItem("Password");
        console.log("executing isLoggedIn");
        console.log("Email: " + email);
        console.log("Password: " + pass);
        var isLoggedIn = false;

        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){
            if(returnVal != "Fail")
                console.log("should be logged in");
                isLoggedIn = true;
        });

        return isLoggedIn;
    },

    renderAccount: function(userData){
        $(document).off("pagecontainerbeforeshow").one("pagecontainerbeforeshow", function(event, data){
            $('#accountsettings_name').val(userData["Name"]);
            $('#accountsettings_email').val(userData["Email"]);
            $('#accountsettings_address').val(userData["Address"]);
            $('#accountsettings_city').val(userData["City"]);
            $('#accountsettings_state').val(userData["State"]);
            $('#accountsettings_zip').val(userData["Zip"]);
            $('#accountsettings_country').val(userData["Country"]);
            $('#accountsettings_acreage').val(userData["Acreage"]);

            $('#saveAccountDetails').click(function(){
                    thisApp.updateAccountDetails();
            });
        });
    },

    updateAccountDetails: function(){
        var out = {
            Name: $('#accountsettings_name').val(),
            Address: $('#accountsettings_address').val(),
            City: $('#accountsettings_city').val(),
            State: $('#accountsettings_state').val(),
            Country: $('#accountsettings_country').val(),
            Zip: $('#accountsettings_zip').val(),
            Phone: $('#accountsettings_phone').val(),
            Acreage: $('#accountsettings_acreage').val(),
            IrrSystem: $('#irrigation_method').val(),
            WaterSource: $('#water_source').val(),
            SoilType: $('#soil_type').val(),
            Mode: 'UpdateUserDetails'
        };

        console.log(out);

        $.getJSON(handler, out, function(returnVal){
            console.log("update successful");
        });
    }
};

    

    
        
            
    
