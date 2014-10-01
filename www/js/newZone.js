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
		$('#new_zone_next_button').off().on("touchstart", function(e){
			newZone.zoneName = $('#zone_name').val();
			newZone.cropName = $('#crop_name').val();
		});
		
		//when 'Start' is clicked
		$('button#track_start').off().on("touchstart", function(e){
			if(newZone.isMapReady == false){
				console.log("Map not ready");
			}
			else{
				$('button#track_start').hide();
				$('button#track_stop').show();
				newZone.startZoneTrace = true;
				newZone.marker.setAnimation(null);
				newZone.marker.setVisible(true);
			}
			
			console.log("start was pressed");
		});

		//when 'Stop' is clicked
		$('button#track_stop').off().on("touchstart", function(e){
			if(newZone.isMapReady == false){
				//newZone.loadMap();
				console.log("Map not ready");
			}
			else{
				$('button#track_stop').hide();
				$('button#track_reset').show();
				newZone.stopTrackingLocation();
			}
		});

		//When 'Save' is clicked
		$('button#track_save').on("touchstart", function(e){

			newZone.saveData();
		});

		//when 'Reset' is clicked
		$('button#track_reset').off().on("touchstart", function(e){
			console.log("reset clicked");
			newZone.clearZone();
			newZone.startZoneTrace = false;
			$('button#track_reset').hide();
			$('button#track_start').show();
			newZone.loadMap();
			$('#popupInfo').remove();
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
                animation: google.maps.Animation.BOUNCE,
                visible: true
            });

            //define map for path to be drawn on
            newZone.pathOptions.map = newZone.map;

	        //need function to get position every second and update the map with the new position and draw the line
	        newZone.startTrackingLocation();
			newZone.isMapReady = true;
			$('#track_start').show();
			$('#track_stop').hide();
			$('#track_reset').hide();
	        console.log("done loading");
        }
        else{
        	console.log("map defined");
        	newZone.marker.setAnimation(google.maps.Animation.BOUNCE);
        	newZone.marker.setVisible(true);
        	newZone.map.setZoom(17);
        	//newZone.infoWindow.close();
        	$('#track_start').show();
        	$('#track_stop').hide();
			$('#track_reset').hide();
        	newZone.startTrackingLocation();
        }
	
	},

	startTrackingLocation: function(){
	/*
	**  Tracks user's location and updates center of map and marker position
	**  Also traces zone if start button has been pressed
	*/

		console.log("starting tracker");

		//watch for changes in user position
		//save watchID to stop tracking later on
        newZone.watchID = navigator.geolocation.watchPosition(onSuccess, onError, newZone.geoOptions);

        //geolocation callback functions
		function onSuccess(position){

			//start tracing only if start has been pushed
			if(newZone.startZoneTrace){
				newZone.traceZone(position)
			}
			console.log("tracking...");
			//update map center and marker position
			newZone.marker.setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
			newZone.map.panTo({lat: position.coords.latitude, lng: position.coords.longitude});	
		}

		function onError(error){
			console.log('message: ' + error.message);
			console.log('code: ' + error.code);
		}
	},

	stopTrackingLocation: function(){
		/*
		**  stops gps tracker, hides marker, and shows zone overview along with info popup
		*/

		console.log("stopping tracker");
		if(newZone.watchID != null){
			navigator.geolocation.clearWatch(newZone.watchID);
			newZone.watchID = null;
		}

		//hide marker
		newZone.marker.setVisible(false);

		//stop tracing zone
		newZone.startZoneTrace = false;

		//Find center of zone
		var bounds = new google.maps.LatLngBounds();
		$.each(newZone.pathTraveled, function(index, LatLng){
			bounds.extend(LatLng);
		});
		var center = bounds.getCenter();

		//create popup info window on 'Stop' button click
		var popupContent = "<div data-role='popup' id='popupInfo'>" +
								"<b>"+newZone.zoneName+"</b><br>" +
								"Crop: "+newZone.cropName+"<br>" +
								"<button id='track_save' type='button' class='ui-btn ui-btn-inline ui-corner-all'>Save</button>" +
							   "</div>";
		//show pop up when map bounds are fit
		google.maps.event.addListenerOnce(newZone.map, 'bounds_changed', function(){
			$('#new_zone_content2').append(popupContent);
		    $('#popupInfo').popup();
	    	google.maps.event.trigger(newZone.myNewZone, 'mousedown');
		});

		// disable default popup events and create custom ones
		$(document).off().one("popupafteropen", function(){
			$('.ui-popup-screen').off();
			$('.ui-popup-screen').addClass("ui-screen-hidden");
			google.maps.event.addListenerOnce(newZone.map, 'click', function(){
				console.log("clicked map!!!");
			});
		});					   

	    //fit map to bounds
		newZone.map.fitBounds(bounds);

		//add mousedown event for popup
		google.maps.event.addListener(newZone.myNewZone, 'mousedown', function(e){
			//newZone.infoWindow.open(newZone.map);
			console.log("open pop");
			$('#popupInfo').popup("open");
		});
	},

	saveData: function(){
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
                    var a = confirm("Zone saved! push ok to go to dashboard");
                    if(a == true)
	                    app.relogin("dashboard");
                }
                else {
                    $.alert("Please Log In Again","Security Time Out");
                    app.relogin("newZone");
                }
            });
        }

	},

	traceZone: function(position){
	/*
	**  Traces new zone as user moves
	*/

		console.log("tracing zone");

		//keep track of where user has been
		if(typeof newZone.pathTraveled == "undefined"){
			newZone.pathTraveled = [];
			newZone.marker.setAnimation(null);
		}

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
	},

	clearZone: function(){
		newZone.myNewZone.setPath([]);
		// delete newZone.myNewZone;
		newZone.pathTraveled = [];
	}
}




