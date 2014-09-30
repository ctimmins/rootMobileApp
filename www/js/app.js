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
        //Check if device is offline
        app.thisConnection = navigator.connection.type;
        //console.log(app.connection);
        if(navigator.connection.type == Connection.NONE){
            console.log("no connection, initially");
            navigator.notification.alert("Warning! No Connection", app.onOffline, "Root, Inc.", "Ok");
        }
        else{
            console.log("cxn type: "+navigator.connection.type);
        }

        //if connected then loses connection
        $(document).on("offline", function(){
            navigator.notification.alert("Warning! Connection Lost", app.onOffline, "Root, Inc.", "Ok");
            return false;
        });
        //if no connection, then connection
        $(document).on("online", function(){
            navigator.notification.alert("Internet Connection Successful!", app.onOnline, "Root, Inc.", "Ok");
        });
        
        //handle ajax errors
        // $(document).ajaxError(function(event, jqXHR, settings, thrownError) {
        //     app.thisEvent = event;
        //     app.jqXHR = jqXHR;
        //     app.theseSettings = settings;
        //     app.thrownError = thrownError;
        //     navigator.notification.alert("Server Error", app.onAjaxError, "Root, Inc.", "Ok");
        // });

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
        
        /*  
            --------------------------------------------------------------------
        **  bind panel events to populate panel with account info and link buttons
        **  to correct pages.  Whenever panel is closed, hide account info
            --------------------------------------------------------------------
        */

        $(document).on("panelbeforeopen", function(e, ui){
            //populate account details and refresh view
            account.renderAccount(app.userData);
            $('#navpanel').trigger('updatelayout');
            $(document).trigger("create");
            //refresh the select menu display
            console.log("refresh select");
            $('div#account_content select').selectmenu("refresh");

            //save account details if save is pressed
            $('#saveAccountDetails').off().on("touchstart", function(){
                account.updateAccount();
            });

            //Logout if logout button is pressed
            $('#logout_button').off().on("touchstart", function(){
                app.logout();
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
        
        // hide account info window whenever panel is closed 
        $(document).on("panelbeforeclose", function(e, ui){
            $('#account_content').hide();
            $('#navpanel').trigger('updatelayout');
        });

        /*  
            --------------------------------------------------------------------
        **  Trigger actions depending on which page is about to be shown
            --------------------------------------------------------------------
        */

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

                case "newzone":
                    newZone.initialize();
                    console.log("newZone1");
                    break;

                case "newzone2":
                    console.log("resizing map");
                    newZone.loadMap();
                    $(document).one("pagecontainertransition", function(e, ui){
                        $(document).one("pagecontainertransition", function(e, ui){
                            newZone.clearZone();
                            newZone.startZoneTrace = false;
                            if(newZone.watchID != null){
                                navigator.geolocation.clearWatch(newZone.watchID);
                                newZone.watchID = null;
                            }
                        });
                    });
                    break;

                default:
                    console.log("current page: " + app.currentPage);
                    break;
            }
        });

        /*  
            --------------------------------------------------------------------
        **  Bind events for buttons on Login page.  'pagebeforecreate' is only
        **  triggered once in the app.
            --------------------------------------------------------------------
        */
        $(document).on('pagebeforecreate', '#login', function(event, ui){
            console.log("creating login page");

            $('#login_button').on("touchstart", function(){
                console.log("login clicked");
                var  email = $('#email').val();
                var pass = $('#pass').val();
                function doNothing(){
                    //do nothing
                }
                if(email == "" && pass != ""){
                    navigator.notification.alert("Please Enter Your Email", doNothing, "Root, Inc.", "Ok");
                }
                else if(email != "" && pass == ""){
                    navigator.notification.alert("Please Enter a Password", doNothing, "Root, Inc.", "Ok");   
                }
                else if(email == "" && pass == ""){
                    navigator.notification.alert("Please Enter Your Email and Password", doNothing, "Root, Inc.", "Ok");       
                }
                else{
                    app.login(email, pass);    
                }
                //app.login(email, pass);    
                
            });
        
        });   
    },

    login: function(email, pass){
        console.log("trying to login");
        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){

            if(returnVal != "Fail"){
                //store user credentials upon successful login
                window.localStorage.setItem("Email", email);
                window.localStorage.setItem("Password", pass);
                //store userData on successful login
                window.localStorage.setItem("UserDetails", returnVal);
                app.userData = returnVal
                //initialize account
                account.initialize();                
                dashboard.loadZones(app.userData["Zones"]);     
            }
            else{
                navigator.notification.alert("Incorrect Email or Password", app.logout, "Root, Inc.", "Ok");
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            navigator.notification.alert("Error Connecting to Server", function doNothing(){}, "Root, Inc.", "Ok");       
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
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            navigator.notification.alert(
                "Unable to Logout", 
                function doNothing(){},
                "Root, Inc.",
                "Ok"
            );       
        });
        
    },

    onOffline: function(){
        console.log("Connection type: " + navigator.connection.type);
        app.thisConnection = navigator.connection.type;
        //disable adding a new Zone
        $('button#new_zone_btn').addClass('ui-disabled');
        //disable account saving
        $('input#saveAccountDetails').button();
        $('input#saveAccountDetails').button('disable');
        $(document).trigger("pagecreate");
    },

    onOnline: function(){
        console.log("Connection type: " + navigator.connection.type);
        app.relogin('dashboard');
        //enable adding a new zone and updating account details
        $('button#new_zone_btn').removeClass('ui-disabled');
        $('input#saveAccountDetails').button();
        $('input#saveAccountDetails').button('enable');
        $(document).trigger("pagecreate");
    },

    onAjaxError: function(){
        console.log("ajax error");
        app.logout();
    },

    userData: null
};



    

    
        
            
    
