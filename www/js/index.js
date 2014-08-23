$('#login').on('click', function(e) {
	console.log("login clicked");
	var  email = $('#email').val(),
		 pass = $('#pass').val();
	$.getJSON(handler, {Email: email, Password: pass, Mode: 'GetUserDetails'}, function(returnVal) {
		console.log(returnVal);
	});
});