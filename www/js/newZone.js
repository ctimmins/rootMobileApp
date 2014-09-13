var newZone = {
	
	geoOptions: {
		maximumAge: 3000,
		timeout: 5000,
		enableHighAccuracy: true
	},

	pathOptions: {
		clickable: false,
	    editable: false,
		strokeColor: '#FF0000'
	},

	initialize: function(){
		
		//when 'Next' is clicked
		$('#new_zone_next_button').on("touchstart", function(e){
			var zoneName = $('#zone_name').val();
			var cropName = $('#crop_name').val();
			//newZone.getLocation();
		});
		
		//when 'Start' is clicked
		$('button#track_start').on("touchstart", function(e){
			$('button#track_start').hide();
			$('button#track_stop').show();
			if(typeof newZone.myPathObj !== "undefined"){
				newZone.myPathObj.setPath([]);
				delete newZone.myPathObj;
			}
			newZone.marker.setAnimation(google.maps.Animation.BOUNCE);
			newZone.trackLocation();
			console.log("start was pressed");
		});

		//when 'Stop' is clicked
		$('button#track_stop').on("touchstart", function(e){
			$('button#track_stop').hide();
			$('button#track_start').show();
			newZone.marker.setAnimation(null);
			navigator.geolocation.clearWatch(newZone.watchID);
			newZone.watchID = null;
			//auto complete path
			//newZone.pathTraveled.push(newZone.pathTraveled[0]);
			//newZone.myPathObj.setPath([]);
			var myNewZone = new google.maps.Polygon(newZone.pathOptions);
			myNewZone.setPath(newZone.pathTraveled);

			//myNewZone.setOptions(fillColor: '#FF0000', fillOpacity: 0.5);
			google.maps.event.addDomListener(myNewZone, 'mousedown', function(e){
				console.log("new zone clicked");
			});
			//delete newZone.myPathObj;
		});

		//when 'Reset' is clicked
		$('button#track_reset').on("touchstart", function(e){
			if(newZone.watchID == null){
				newZone.myPathObj.setPath([]);
				newZone.pathTraveled = [];
			}
		});

		newZone.getInitialLocation();
	},

	getInitialLocation: function(){
	/*
	** called when newzone1 page is loaded
	*/
		
		var myAddress;
		if (app.userData.Address == "") 
			myAddress = app.userData.Zip;
		else
			myAddress = app.userData.Address+", "+app.userData.State+" "+app.userData.Zip ;

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": myAddress}, function(results){
			var Lat = results[0].geometry.location.lat();
			var Long = results[0].geometry.location.lng();
			newZone.currentLocation = {"lat": Lat, "lng": Long};
		});

		navigator.geolocation.getCurrentPosition(onSuccess, onError, newZone.geoOptions);

		//geolocation callback functions
		function onSuccess(position){
			console.log("geolocation was a success");
			var Lat = position.coords.latitude;
			var Long = position.coords.longitude;
			newZone.currentLocation = {"lat": Lat, "lng": Long};

		}

		function onError(error){		
			alert('message: ' + error.message);
		}
	
		
		
			
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
                //animation: google.maps.Animation.BOUNCE,
                visible: true
            });

            //define map for path to be drawn on
            newZone.pathOptions.map = newZone.map;

	        //need function to get position every second and update the map with the new position and draw the line
	        //newZone.trackLocation();
			
	        console.log("done loading");
        }
        else{
        	console.log("map defined");
        	//newZone.trackLocation();
        }
	
	},

	trackLocation: function(){
		console.log("entering trackLocation");
		
		//show marker
		newZone.marker.visible = true;
		newZone.marker.setAnimation(google.maps.Animation.BOUNCE);

		//keep track of where user has been
		newZone.pathTraveled = [];
		//var myPathObj;

		//watch for changes in user position
		//save watchID to stop tracking later on
        newZone.watchID = navigator.geolocation.watchPosition(onSuccess, onError, newZone.geoOptions);

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
				newZone.pathTraveled.push(new google.maps.LatLng(newZone.currentLocation.lat, newZone.currentLocation.lng));
				//and draw new path
				if(typeof newZone.myPathObj === "undefined"){
					newZone.myPathObj = new google.maps.Polyline(newZone.pathOptions);
					newZone.myPathObj.setPath(newZone.pathTraveled);
					console.log("undefined myPathObj");
				}
				else
					newZone.myPathObj.setPath(newZone.pathTraveled);
			}
			console.log("Watching..."); 

		}

		function onError(error){
			console.log('message: ' + error.message);
			console.log('code: ' + error.code);
		}
	}
}




