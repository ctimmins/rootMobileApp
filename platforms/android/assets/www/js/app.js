/*  js/app.js  */

//var handler = 'http://farmperfect.com/libs/php/manager.php';
var handler = 'http://54.186.32.104/libs/php/manager.php';

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


        //prepend nav panel and try login.  only triggered once
        $(document).one("pagecontainerbeforechange", function(e, ui){
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src  = "http://maps.google.com/maps/api/js?v=3&sensor=true&callback=gmap_draw";
            window.gmap_draw = function(){
                //map.getCurrentLocation();
                //map.onSuccess(pos);
                console.log("maps script loaded");
            };
            $("head").append(s);

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
        });
        
        //bind panel events
        $(document).on("panelbeforeopen", function(e, ui){
            //populate account details and refresh view
            account.renderAccount(app.userData);
            $('#navpanel').trigger('updatelayout');
            $(document).trigger("create");

            //save account details if save is pressed
            $('#saveAccountDetails').on("touchstart", function(){
                account.updateAccount();
            });

            //toggle account display
            $('#my_account_btn').on("touchstart", function(){
                // $('#account_content').toggle();
                if($('#account_content').is(':hidden'))
                    $('#account_content').slideDown(400);
                else
                    $('#account_content').slideUp(300);
            });
        });

        //unbind panel events and close account details
        $(document).on("panelbeforeclose", function(e, ui){
            $('#saveAccountDetails').off();
            $('#my_account_btn').off();
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
                case "dashboard":
                    dashboard.loadZones(app.userData["Zones"]);
                    break;
                default:
                    console.log("current page: " + ui.toPage.attr('id'));
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

        //bind dashboard events
        $(document).on("pagebeforecreate", "#dashboard", function(event, ui){
            //populate dashboard 
            //$(document).on("scrollstart", '.zone-body', false);
            //dashboard.loadZones(app.userData["Zones"]);
        });

        //bind map events
        $(document).on("pagebeforecreate", '#map', function(event, ui){
            //map.getCurrentLocation();
            map.onSuccess();
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
                $('body').pagecontainer("change", "#dashboard");     
            }
            else{
                app.logout();
            }
        });    
    },

    renderHomeView: function(){
        console.log("rendering home view");        
    },

    renderMapView: function(){
        console.log("rendering map view");
    },

    logout: function(){
        $('body').pagecontainer("change", "#login");
        console.log("logging out");
        //clear user credentials
        window.localStorage.clear();
        //show login screen
        app.userData = null;
    },

    userData: null
};



    

    
        
            
    
