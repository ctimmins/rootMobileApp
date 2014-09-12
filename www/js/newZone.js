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
		newZone.getInitialLocation();
	},

	getInitialLocation: function(){
	/*
	** called when newzone1 page is loaded
	*/
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
			myAddress = app.userData.Address+", "+app.userData.State+" "+app.userData.Zip ;
		console.log(myAddress);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": myAddress}, function(results){
			var Lat = results[0].geometry.location.lat();
			var Long = results[0].geometry.location.lng();
			newZone.currentLocation = {"lat": Lat, "lng": Long};
            console.log(newZone.currentLocation);
		});	
		
			
	},

	loadMap: function(){
	/*
	**  loads map and shows current location
	*/
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
	        newZone.trackLocation();
			
	        console.log("done loading");
        }
        else{
        	console.log("map not defined");
        	newZone.trackLocation();
        }
	
	},

	trackLocation: function(){
		console.log("entering trackLocation");
		
		//show marker
		newZone.marker.visible = true;
		//keep track of where user has been
		var pathTraveled = [];

		//watch for changes in user position
        navigator.geolocation.watchPosition(onSuccess, onError, newZone.geoOptions);

        //geolocation callback functions
		function onSuccess(position){
			//if previous coordinate isnt the same as current position
			if(newZone.currentLocation.lat != position.coords.latitude && newZone.currentLocation.lng != position.coords.longitude){
				//update current location with new coordinates 
				newZone.currentLocation.lat = position.coords.latitude;
				newZone.currentLocation.lng = position.coords.longitude;
				//update map center and marker position
				newZone.marker.setPosition({lat: newZone.currentLocation.lat, lng: newZone.currentLocation.lng});
				newZone.map.setCenter({lat: newZone.currentLocation.lat, lng: newZone.currentLocation.lng});
				//add new coordinate to path traveled
				pathTraveled.push(new google.maps.LatLng(newZone.currentLocation.lat, newZone.currentLocation.lng));
				console.log(pathTraveled);
				//and draw new path
			} 
			// newZone.currentLocation.lat = position.coords.latitude;
			// newZone.currentLocation.lng = position.coords.longitude;

			//update map center and marker position
			// newZone.marker.visible = true;
			// newZone.marker.setPosition({lat: newZone.currentLocation.lat, lng: newZone.currentLocation.lng});
			// newZone.map.setCenter({lat: newZone.currentLocation.lat, lng: newZone.currentLocation.lng});
			//draw path
			//pathTraveled.push(new google.maps.LatLng(newZone.currentLocation.lat, newZone.currentLocation.lng));
			
			// var pathOptions = {
			// 	clickable: false,
			// 	editable: true,
			// 	map: newZone.map,
			// 	strokeColor:
			// 	path: pathTraveled,
			// };
			// var myPath = new google.maps.Polyline(pathOptions);
		}

		function onError(error){
			console.log('message: ' + error.message);
			console.log('code: ' + error.code);
		}
	}
}




