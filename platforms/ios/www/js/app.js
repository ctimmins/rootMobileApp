/*  js/app.js  */

//var handler = 'http://farmperfect.com/libs/php/manager.php';
var handler = 'http://54.186.32.104/libs/php/manager.php';

$(document).on('deviceready', function(){
    console.log("deviceready");

    $(document).on('mobileinit', function(){
        console.log("jqm has been loaded");
        $.mobile.maxTransitionWidth = 0;
        $("#splash").hide();
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

        //prepend nav panel and try login.  only triggered once
        $(document).one("pagecontainerbeforechange", function(e, ui){
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src  = "http://maps.google.com/maps/api/js?libraries=drawing,places&v=3&sensor=true&callback=gmap_draw";
            $("head").append(s);
            window.gmap_draw = function()
            {
                console.log("maps script loaded");

                $.get('templates/navpanel.html', function(template){
                    console.log("appending navpanel");
                    var panel = template;
                    $.mobile.pageContainer.prepend(panel);
                    $('#navpanel').panel();
                    
                });

                //retrieve user credentials from local storage and try login
                var email = window.localStorage.getItem("Email");
                var pass = window.localStorage.getItem("Password");

                if(email != null && pass != null) {
                    app.login(email, pass);
                }
                else{
                    app.logout();
                }

                e.preventDefault();
                console.log(app.userData);
            };
        });
        
        //bind panel events
        $(document).on("panelbeforeopen", function(e, ui){
            //populate account details and refresh view
            account.renderAccount(app.userData);
            $('#navpanel').trigger('updatelayout');
            $(document).trigger("create");

            //save account details if save is pressed
            $('#saveAccountDetails').off().on("touchstart", function(){
                account.updateAccount();
            });

            //toggle account display
            $('#my_account_btn').off().on("touchstart", function(){
                // $('#account_content').toggle();
                if($('#account_content').is(':hidden'))
                    $('#account_content').slideDown(400);
                else
                    $('#account_content').slideUp(300);
            });
            
             //navpanel links
            $("#new_zone_btn").off().on("touchstart",function()
            {
                $('#navpanel').panel( "close" );
                $('body').pagecontainer("change", "#newzone");
            });
            $("#dashboard_btn").off().on("touchstart",function()
            {
                $('#navpanel').panel( "close" );
                $('body').pagecontainer("change", "#dashboard");
            });
            
            //refresh page
             $("#refreshDashboard").off().on("touchstart",function()
             {
                app.relogin("dashboard");
             });
            
        });

        //unbind panel events and close account details
        $(document).on("panelbeforeclose", function(e, ui){
            $('#account_content').hide();
            $('#navpanel').trigger('updatelayout');
        });

        $(document).on("pagecontainerbeforeshow", function(e, ui){
            
            app.currentPage = ui.toPage.attr('id');

            switch(app.currentPage){
                case "login":
                    //clear user credentials
                    window.localStorage.clear();
                    app.userData = null;
                    //$('#login_button').val('');
                    $('#pass').val('');
                    break;
                case "newzone2":
                    newZone.loadMap();
                    break;
                default:
                    console.log("current page: " + app.currentPage);
                    break;
            }
        });

        //bind login events
        $(document).on('pagebeforecreate', '#login', function(event, ui){
            console.log("creating login page");

            $('#login_button').on("touchstart", function(){
                console.log("login clicked");
                var  email = $('#email').val();
                var pass = $('#pass').val();
                app.login(email, pass);
            });
        
        });

        //bind new zone events
        $(document).on('pagebeforecreate', '#newzone', function(event, ui){
            newZone.initialize();
        })   
    },

    login: function(email, pass){
        console.log("trying to login");
        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){

            if(returnVal != "Fail"){
                //store user credentials upon successful login
                window.localStorage.setItem("Email", email);
                window.localStorage.setItem("Password", pass);
                //store userData on successful login
                app.userData = returnVal
                //initialize account
                account.initialize();                
                dashboard.loadZones(app.userData["Zones"]);     
            }
            else{
                app.logout();
            }
        });    
    },
    
    relogin: function(page){
        
        var email = window.localStorage.getItem("Email");
        var pass = window.localStorage.getItem("Password");
        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){
            if(returnVal != "Fail"){
                //store user credentials upon successful login
                window.localStorage.setItem("Email", email);
                window.localStorage.setItem("Password", pass);
                //store userData on successful login
                app.userData = returnVal
                if(page == "dashboard")
                    dashboard.loadZones(app.userData["Zones"]);     
            }
            else{
                app.logout();
            }
        });    
        
    },

    logout: function(){
        $.getJSON(handler,{Mode: 'Logout'}, function(returnVal)
        {
            $('body').pagecontainer("change", "#login");
            console.log("logging out");
            //clear user credentials
            window.localStorage.clear();
            //show login screen
            app.userData = null;
        });
        
    },

    userData: null
};



    

    
        
            
    
