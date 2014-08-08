/*  js/app.js  */

define(function(require){
    console.log("got to top of app");
    var $ = require('jquery');
    var HomeView = require('app/views/HomeView');
    var FastClick = require('fastclick')

    var app = {  
        // Application Constructor
        initialize: function() {
            console.log("got to app init");
            this.bindEvents();
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            console.log("got to bindEvents");
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            console.log("got to onDeviceReady");
            FastClick.attach(document.body);
            app.receivedEvent('deviceready');
        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {

            $('[data-role=page]').css("background", "url(./img/root-background-4.jpg)")    
           
            var homeView = new HomeView({el: '[data-role=page]'});
            console.log('Received Event: ' + id);

            
        }
    };
    return app;
});
