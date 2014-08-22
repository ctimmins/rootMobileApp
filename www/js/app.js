/*  js/app.js  */

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
            console.log("email: " + email);
            console.log("password: " + pass);
            if(email != null && pass != null) {
                thisApp.login(email, pass);
            }
            else{
                thisApp.logout();
            }
            e.preventDefault();
            console.log(thisApp.userData);
        });

        $(document).on("pagecontainerbeforeshow", function(e, ui){
            console.log("current page: " + ui.toPage.attr('id'));
        })

        $(document).on('pagebeforecreate', '#dashboard', function(event, ui){
            console.log("pagebeforecreate for dashboard");
        });


        $(document).on('pagebeforecreate', '#login', function(event, ui){
            console.log("creating login page");

            $('#login_button').on("touchstart", function(){
                console.log("login clicked");
                var  email = $('#email').val();
                var pass = $('#pass').val();
                console.log("email: " + email);
                console.log("pw: " + pass);
                thisApp.login(email, pass);
            });
        
        });

        // $(document).on('pagebeforecreate', '#account', function(event, ui){
        //     console.log("showing account");
        //     //thisApp.renderAccount(returnVal);
        //     $('#account_button').click(function(){
        //         thisApp.renderAccount(returnVal);
        //     });
        //     $('#logout_button').click(function(){
        //         thisApp.logout();
        //     });
        // });      
    },

    login: function(email, pass){
        console.log("trying to login");
        $.getJSON(handler, {Email: email, Password: pass, Mode: "GetUserDetails"}, function(returnVal){
            console.log("request returned");
            if(returnVal != "Fail"){
                //store user credentials upon successful login
                window.localStorage.setItem("Email", email);
                window.localStorage.setItem("Password", pass);
                
                //initialize account
                account.initialize();
                //change page to dashboard                
                $('body').pagecontainer("change", "#dashboard", {allowSamePageTransition: true});


            }
            else{
                thisApp.logout();
            }
        });    
    },

    renderHomeView: function(){
        console.log("rendering home view");        
    },

    renderMapView: function(){
        console.log("rendering map view");
    },

    renderAccount: function(userData){
        $(document).off("pagecontainerbeforeshow").on("pagecontainerbeforeshow", function(event, data){
            $('#accountsettings_name').val(userData["Name"]);
            $('#accountsettings_email').val(userData["Email"]);
            $('#accountsettings_address').val(userData["Address"]);
            $('#accountsettings_city').val(userData["City"]);
            $('#accountsettings_state').val(userData["State"]);
            $('#accountsettings_zip').val(userData["Zip"]);
            $('#accountsettings_country').val(userData["Country"]);
            $('#accountsettings_acreage').val(userData["Acreage"]);

            $('#logout_button').click(function(){
                thisApp.logout();
            });
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

        $.getJSON(handler, out, function(returnVal){
            console.log("update successful");
        });
    },

    logout: function(){
        $('body').pagecontainer("change", "#login", {allowSamePageTransition: true});
        console.log("logging out");
        //clear user credentials
        window.localStorage.clear();
        //show login screen
        
        
        //$('body').pagecontainer("change");
        //$(document).trigger('createpage');
       
    },

    userData: {
        Name: "chad",
        address: "123 yes lane"
    }
};



    

    
        
            
    
