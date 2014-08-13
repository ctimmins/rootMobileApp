/*  js/app.js  */
console.log("loaded app.js");     
$(document).on('ready', function(){
    console.log("deviceready");

    $(document).on('mobileinit', function(){
        console.log("jqm has been loaded");
        //prepend nav panel on each page load
        $(document).one("pagebeforecreate", function(){
            $.get('templates/navpanel.html', function(template){
                var panel = template;
                $.mobile.pageContainer.prepend(panel);
                $('#navpanel').panel();
            });
        });
        //log current page and html on each page change
        $(document).on("pagecontainerbeforeshow", function(event, data){
            var pageId = $('body').pagecontainer('getActivePage').attr('id');
            console.log("current page: " + pageId);
         });

        app.renderHomeView();
    })
    
    $('body').append('<script type="text/javascript" src="js/lib/jquery/jquery.mobile-1.4.3.min.js"></script>');

});

var app = {

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
    }
};

// $(document).one("pagebeforecreate", function(){
//     $.get('templates/navpanel.html', function(template){
//         var panel = template;
//         $.mobile.pageContainer.prepend(panel);
//         $('#navpanel').panel();
//     });
// });

//  $(document).on("pagecontainerbeforeshow", function(event, data){
//     var pageId = $.mobile.activePage.attr('id')
//     console.log("current page: " + pageId);
//     console.log("");
//     console.log($('body').html());
//  });
