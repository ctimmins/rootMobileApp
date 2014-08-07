/*  js/app.js  */

define(function(require){
    var $ = require('jquery');
    var app = {
        //global variable indicating device is ready
        

        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },

        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            this.isDeviceReady = true;
            app.receivedEvent('deviceready');
        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {

            $('#main_content').css("background", "url(./img/root-background-6.jpg)")    
            
            
            //$('#main_content').append('<li>Helloooooo</li>');

            console.log('Received Event: ' + id);
        }
    };
    return app;
});
