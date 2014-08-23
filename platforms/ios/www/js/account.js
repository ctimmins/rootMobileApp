/* account.js */

var account = {

	initialize: function(){
		console.log("initializing account");
		$(document).on("pagebeforecreate", "#account", function(event, ui){
			account.renderAccount(app.userData);

			$('#logout_button').on("touchstart", function(){
				console.log("account logout");
				app.logout();
			});

			$('#saveAccountDetails').on("touchstart", function(){
				account.updateAccount();
			});		
		});
	},

	renderAccount: function(userData){
		console.log("rendering account");
		$('#accountsettings_name').val(userData["Name"]);
        $('#accountsettings_email').val(userData["Email"]);
        $('#accountsettings_phone').val(userData["Phone"]);
        $('#accountsettings_address').val(userData["Address"]);
        $('#accountsettings_city').val(userData["City"]);
        $('#accountsettings_state').val(userData["State"]);
        $('#accountsettings_zip').val(userData["Zip"]);
        $('#accountsettings_country').val(userData["Country"]);
        $('#accountsettings_acreage').val(userData["Acreage"]);
        $('select#water_source').val(userData["Water Source"]);
        //$('select#water_source').selectmenu('refresh');
        $('select#irrigation_method').val(userData["Irrigation System"]);
        //$('select#irrigation_method').selectmenu('refresh');
        $('select#soil_type').val(userData["Soil Type"]);
        //$('select#soil_type').selectmenu('refresh');
	},

	updateAccount: function(){
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
            console.log("update " + returnVal);
            if(returnVal == "Success"){
				app.userData["Name"] = $('#accountsettings_name').val();
				app.userData["Email"] = $('#accountsettings_email').val();
				app.userData["Phone"] = $('#accountsettings_phone').val();
				app.userData["Address"] = $('#accountsettings_address').val();
				app.userData["City"] = $('#accountsettings_city').val();
				app.userData["State"] = $('#accountsettings_state').val();
				app.userData["Zip"] = $('#accountsettings_zip').val();
				app.userData["Country"] = $('#accountsettings_country').val();
				app.userData["Acreage"] = $('#accountsettings_acreage').val();
				app.userData["Water Source"] = $('#water_source').val();
				app.userData["Irrigation System"] = $('#irrigation_method').val();
            	app.userData["Soil Type"] = $('select#soil_type').val();
            }
        });
	}
}

