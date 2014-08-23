/* account.js */

var account = {

	initialize: function(){
		console.log("initializing account");
		$(document).on("pagebeforecreate", "#account", function(event, ui){
			$('#logout_button').on("touchstart", function(){
				console.log("account logout");
				app.logout();
			});
			account.renderAccount(app.userData);
		});
	},

	renderAccount: function(userData){
		console.log("rendering account");
		$('#accountsettings_name').val(userData["Name"]);
        $('#accountsettings_email').val(userData["Email"]);
        $('#accountsettings_address').val(userData["Address"]);
        $('#accountsettings_city').val(userData["City"]);
        $('#accountsettings_state').val(userData["State"]);
        $('#accountsettings_zip').val(userData["Zip"]);
        $('#accountsettings_country').val(userData["Country"]);
        $('#accountsettings_acreage').val(userData["Acreage"]);
	},

	updateAccount: function(){

	}

}

