/*  js/app.js  */

define(function(require){
    console.log("got to top of app");
    var $ = require('jquery');
    var Backbone = require('backbone');
    console.log("imported backbone");
    var jqm = require('jqm');


    
    var _ = require('underscore'),
        homeTemplate = require('text!templates/homeTemplate.html');

    var compiledTemplate = _.template(homeTemplate);

    var HomeView = Backbone.View.extend({

        initialize: function(){
            console.log("got to View init");
            this.render();
        },

        render: function(){
            console.log("got to view render");
            this.$el.html(compiledTemplate());
            $('#main_content').trigger("create");
        }
    }); 






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
            app.receivedEvent('deviceready');
        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {

            $('#main_content').css("background", "url(./img/root-background-6.jpg)")    
           
           var homeView = new HomeView({el: '#nav_bar'});
           //console.log($('#main_content'));
            console.log('Received Event: ' + id);

            
        }
    };
    return app;
});
