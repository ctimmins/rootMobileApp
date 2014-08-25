var map = {
	
	getCurrentLocation: function(){
		console.log("getting location");
		var options = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(map.onSuccess, map.onError, options);
	},

	onSuccess: function(){
		console.log("was successful");
		//var longitude = position.coords.longitude;
		//var latitude = position.coords.latitude;
		var latitude = 38.548333239992715;
		var longitude = -121.77787782624364;

		var mapOptions = {
			mapTypeId: google.maps.MapTypeId.SATELLITE,
			center: new google.maps.LatLng(latitude, longitude),
			zoom: 14,
			overviewMapControl: false,
			panControl: false,
			disableDefaultUI: true
		}
		console.log("was successful 2");
		//var map = new google.maps.Map($('#map_canvas')[0], mapOptions);
	},

	onError: function(error){
		alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	}
}