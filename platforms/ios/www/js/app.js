/*  js/app.js  */

var handler = 'http://farmperfect.com/libs/php/manager.php';


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

        $(document).on("pagecontainerbeforeshow", function(e, ui){
            console.log("current page: " + ui.toPage.attr('id'));
            app.currentPage = ui.toPage.attr('id');
        })

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
            dashboard.loadZones(app.userData["Zones"]);
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
                app.userData = returnVal
                //initialize account
                account.initialize();
                //change page to dashboard
                // if(app.currentPage == "account"){
                //     $('body').pagecontainer("change", "templates/account.html", {allowSamePageTransition: true});       
                // }
                // else{
                //     $('body').pagecontainer("change", "#dashboard", {allowSamePageTransition: true});     
                // }                
                $('body').pagecontainer("change", "#dashboard", {allowSamePageTransition: true});     
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
        $('body').pagecontainer("change", "#login", {allowSamePageTransition: true});
        console.log("logging out");
        //clear user credentials
        window.localStorage.clear();
        //show login screen
        app.userData = null;
    },

    userData: null
};



    

    
        
            
    
