/*  js/app.js  */
     
$(document).on('deviceready', function(){
    console.log("deviceready");
    $(document).on('mobileinit', function(){
        console.log("jqm has been loaded");
        app.renderHomeView();
    })
    $.getScript('js/lib/jquery/jquery.mobile-1.4.3.min.js');
});

var app = {

    renderHomeView: function(){
        console.log("rendering home view");
        $(document).ready(function(){
            $.get('templates/homeTemplate.html', function(template){
                $('#home').css("background", "url(./img/root-background-4.jpg)")
                $('#home').html(template).trigger("create");
            });        

        });
        
    },

    renderMapView: function(){
        console.log("rendering map view");
        $('body').pagecontainer('load', 'templates/maps.html', {
            role: "page",
            id: "map"
        });
    }
};

 $(document).on("pagecontainerchange", function(event, data){
     console.log("current page: " + $.mobile.activePage.attr('id'));
 });
