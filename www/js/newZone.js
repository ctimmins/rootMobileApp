var newZone = {
	geoOptions: {
				maximumAge: 3000,
				timeout: 5000,
				enableHighAccuracy: true
	},

	initialize: function(){
		
		//when 'Next' is clicked
		$('#new_zone_next_button').on("touchstart", function(e){
			var zoneName = $('#zone_name').val();
			var cropName = $('#crop_name').val();
			//newZone.getLocation();
		});
		newZone.getLocation();
	},

	getLocation: function(){
		var useCurrentLocation = true;
	
		console.log("entering geolocation function");
		navigator.geolocation.getCurrentPosition(onSuccess, onError, newZone.geoOptions);

		//geolocation callback functions
		function onSuccess(position){
			console.log("geolocation was a success");

		}

		function onError(error){
			alert('message: ' + error.message);
		}
	
		var myAddress;
		if (app.userData.Address == "") 
			myAddress = app.userData.Zip;
		else
			myAddress = app.userData.Address;

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": myAddress}, function(results){
			var Lat = results[0].geometry.location.lat();
			var Long = results[0].geometry.location.lng();
			newZone.currentLocation = {"lat": Lat, "lng": Long};
            console.log(newZone.currentLocation);
		});	
		
			
	},

	loadMap: function(){
		console.log("loading map");
        
        if(typeof newZone.map === "undefined")
        {

            var lat = newZone.currentLocation.lat;
            var lng = newZone.currentLocation.lng;
            
            console.log(newZone.currentLocation);

            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                center: new google.maps.LatLng(lat, lng),
                zoom: 17,
                disableDefaultUI: true
            }

            //calculate height for map
            var mapHeight = $(window).height() - $('div[data-role=header]:visible').height();
            $('#map_canvas').css("height", mapHeight);
            //create map object

            newZone.map = new google.maps.Map($('#map_canvas')[0], mapOptions);
            
            //create marker object
            newZone.marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: newZone.map,
                animation: google.maps.Animation.BOUNCE,
                visible: false
            });

	        //need function to get position every second and update the map with the new position and draw the line
	         console.log("entering watchPosition");
	        navigator.geolocation.watchPosition(onSuccess, onError, newZone.geoOptions);
	        //geolocation callback functions
			function onSuccess(position){
				console.log("watchPosition was a success");
				console.log("Lat: " + position.coords.latitude);
				console.log("Long: " + position.coords.longitude);
				newZone.marker.visible = true;
				newZone.marker.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				newZone.map.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			}
			function onError(error){
				console.log("got error");
			}
			
	        console.log("done loading");
        }

        
        
		
		
        //var drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
	},
}