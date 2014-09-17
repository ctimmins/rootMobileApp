var newZone = {
	isMapReady: false,

	geoOptions: {
		maximumAge: 3000,
		timeout: 5000,
		enableHighAccuracy: true
	},

	pathOptions: {
		clickable: true,
	    editable: false,
		strokeColor: '#FF0000',
		fillColor: '#FF0000',
		fillOpacity: .4
	},

	initialize: function(){
		
		//when 'Next' is clicked
		$('#new_zone_next_button').on("touchstart", function(e){
			newZone.zoneName = $('#zone_name').val();
			newZone.cropName = $('#crop_name').val();
			//newZone.getLocation();
		});
		
		//when 'Start' is clicked
		$('button#track_start').on("touchstart", function(e){
			if(newZone.isMapReady == false){
				//newZone.loadMap();
				console.log("Map not ready");
			}
			else{
				$('button#track_start').hide();
				$('button#track_stop').show();
				newZone.startZoneTrace = true;
				newZone.marker.setVisible(true);
			}
			
			//newZone.marker.setAnimation(google.maps.Animation.BOUNCE);
			console.log("start was pressed");
		});

		//when 'Stop' is clicked
		$('button#track_stop').on("touchstart", function(e){
			if(newZone.isMapReady == false){
				//newZone.loadMap();
				console.log("Map not ready");
			}
			else{
				$('button#track_stop').hide();
				$('button#track_save').show();
				//stop bouncing marker and hide
				newZone.marker.setAnimation(null);
				newZone.marker.setVisible(false);
				//stop tracing zone and tracking location
				newZone.startZoneTrace = false;
				newZone.stopTrackingLocation();
				
				//Find center of zone
				var bounds = new google.maps.LatLngBounds();
				$.each(newZone.pathTraveled, function(index, LatLng){
					bounds.extend(LatLng);
				});
				var center = bounds.getCenter();

				//fit map to bounds
				newZone.map.fitBounds(bounds);

				//create info window on 'Stop' button click
				var contentString = "<b>"+newZone.zoneName+"</b><br>"+
									"Crop: "+newZone.cropName+"<br>"+
									"Center: "+center.lat()+", "+center.lng()+"<br>";
				newZone.infoWindow = new google.maps.InfoWindow({content: contentString, position: center});
				newZone.infoWindow.open(newZone.map);
			}
			
			google.maps.event.addListener(newZone.myNewZone, 'mousedown', function(e){
				newZone.infoWindow.open(newZone.map);
			});
		});

		//When 'Save' is clicked
		$('button#track_save').on("touchstart", function(e){

			newZone.saveData();
		});

		//when 'Reset' is clicked
		$('button#track_reset').on("touchstart", function(e){
			console.log("reset clicked");
			//watchID is null if stop has been clicked
			if(newZone.watchID == null){
				newZone.clearZone();
				newZone.startZoneTrace = false;
				$('button#track_save').hide();
				$('button#track_start').show();
				$('button#track_stop').hide();
				newZone.infoWindow.close();
			}
			else {
				newZone.marker.setAnimation(null);
				newZone.stopTrackingLocation();
				newZone.clearZone();
				newZone.startZoneTrace = false;
				$('button#track_stop').hide();
				$('button#track_start').show();
			}
		});

		newZone.getInitialLocation();
	},

	getInitialLocation: function(){
	/*
	** called when newzone1 page is loaded
	*/
		
		navigator.geolocation.getCurrentPosition(onSuccess, onError, newZone.geoOptions);

		//geolocation callback functions
		function onSuccess(position){
			console.log("initial location was a success");
			var Lat = position.coords.latitude;
			var Long = position.coords.longitude;
			newZone.currentLocation = {"lat": Lat, "lng": Long};
		}

		function onError(error){		
			useDefaultLocation();
		}

		//default location if geolocation fails
		function  useDefaultLocation(){
			console.log("using default location");
			var myAddress;

			//if user does NOT have a saved address use the ZIP
			if (app.userData.Address == "") 
				myAddress = app.userData.Zip;
			else  //otherwise use full address for geocoder
				myAddress = app.userData.Address+", "+app.userData.State+" "+app.userData.Zip ;

			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({"address": myAddress}, function(results){
				if(typeof results[0] == "undefined"){
					$.getJSON(handler,{Zip:returnVal.ZipCode,Mode:"ZipToLatLon"}, function(returnVal){
                    newZone.currentLocation = {"lat": returnVal.Lat, "lng": returnVal.Long};
	                });
				}
				else {
					var Lat = results[0].geometry.location.lat();
					var Long = results[0].geometry.location.lng();
					newZone.currentLocation = {"lat": Lat, "lng": Long};
				}
			});	
		}		
	},

	loadMap: function(){
	/*
	**  creates and/or loads map and shows current location
	*/
		console.log("loading map");
        
        //if newZone.map is undefined, create a new google.maps.Map object
        //centered at current location
        if(typeof newZone.map === "undefined")
        {

            var lat = newZone.currentLocation.lat;
            var lng = newZone.currentLocation.lng;

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
                visible: true
            });

            //define map for path to be drawn on
            newZone.pathOptions.map = newZone.map;

	        //need function to get position every second and update the map with the new position and draw the line
	        newZone.startTrackingLocation();
			newZone.isMapReady = true;
			$('#track_start').show();
			$('#track_reset').show();
	        console.log("done loading");
	        newZone.startTrackingLocation();
        }
        else{
        	console.log("map defined");
        	newZone.startTrackingLocation();
        }
	
	},

	startTrackingLocation: function(){
		console.log("starting tracker");
		
		//watch for changes in user position
		//save watchID to stop tracking later on
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, newZone.geoOptions);

        //geolocation callback functions
		function onSuccess(position){
			//update map center and marker position
			newZone.marker.setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
			newZone.map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
			console.log("tracking location");
			//start tracing only if start has been pushed
			if(newZone.startZoneTrace){
				newZone.traceZone(position)
			}
		}

		function onError(error){
			console.log('message: ' + error.message);
			console.log('code: ' + error.code);
		}
	},

	stopTrackingLocation: function(){
		console.log("stopping tracker");
		if(watchID != null){
			navigator.geolocation.clearWatch(watchID);
			watchID = null;
		}
	},

	saveData: function(center, pathList){
		console.log("saving data");

		//Find center of zone and create pathList string
		var pathList = [];
		var bounds = new google.maps.LatLngBounds();
		$.each(newZone.pathTraveled, function(index, LatLng){
			pathList.push([LatLng.lat(), LatLng.lng()]);
			bounds.extend(LatLng);
		});
		var center = bounds.getCenter();


		if(newZone.cropName == "" || newZone.zoneName == "") {
            $.alert("Sorry, something went wrong! Please try again", ":(");
        }
        else {
            $.getJSON(handler,{Name: newZone.cropName, Crop: newZone.zoneName, Lat:center.lat(),Long:center.lng(),Border:pathList.join(";"),Mode:"CreateZone"}, function(returnVal){
                if(returnVal == "Success") {
                    console.log("zone created!");
                    $('body').pagecontainer("change", "#dashboard");
                }
                else {
                    $.alert("Please Log In Again","Security Time Out");
                    app.relogin("newZone");
                }
            });
        }

	},

	traceZone: function(position){
		console.log("tracing zone");

		//show marker bouncing
		newZone.marker.setAnimation(google.maps.Animation.BOUNCE);

		//keep track of where user has been
		if(typeof newZone.pathTraveled == "undefined")
			newZone.pathTraveled = [];

		//if previous coordinate isnt the same as current position
		if(newZone.currentLocation.lat != position.coords.latitude && newZone.currentLocation.lng != position.coords.longitude){
			//update current location with new coordinates 
			newZone.currentLocation.lat = position.coords.latitude;
			newZone.currentLocation.lng = position.coords.longitude;
			//add new coordinate to path traveled
			newZone.pathTraveled.push(new google.maps.LatLng(newZone.currentLocation.lat, newZone.currentLocation.lng));
			//and draw new polygon zone
			if(typeof newZone.myNewZone == "undefined"){
				newZone.myNewZone = new google.maps.Polygon(newZone.pathOptions);
				newZone.myNewZone.setPath(newZone.pathTraveled);
			}
			else
				newZone.myNewZone.setPath(newZone.pathTraveled);
		}
		console.log("Watching..."); 
	},

	clearZone: function(){
		newZone.myNewZone.setPath([]);
		newZone.pathTraveled = [];
	}
}




