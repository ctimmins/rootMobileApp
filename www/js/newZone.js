var newZone = {

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
		var useCurrentLocation = false;
		if (useCurrentLocation){

		}
		else {
			console.log("using hard code");
			var geocoder = new google.maps.Geocoder();
			var myAddress = "425 University Ave., Davis, CA";
			geocoder.geocode({"address": myAddress}, function(results){
				var Lat = results[0].geometry.location.lat();
				var Long = results[0].geometry.location.lng();
				newZone.currentLocation = {"lat": Lat, "lng": Long};
			});	
		}
			
	},

	loadMap: function(){
		console.log("loading map");
		//var myAddress = "425 University Ave., Davis, CA";
		//var Lat, Long;
		//var geocoder = new google.maps.Geocoder();
		// geocoder.geocode({"address": myAddress}, function(results){
		// 	var Lat = results[0].geometry.location.lat();
		// 	var Long = results[0].geometry.location.lng();

		// 	var mapOptions = {
	 //            mapTypeId: google.maps.MapTypeId.SATELLITE,
	 //            center: new google.maps.LatLng(Lat, Long),
	 //            zoom: 17
	 //        };
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
        google.maps.event.trigger(newZone.map, "resize");
        //create marker object
        var marker = new google.maps.Marker({
        	position: new google.maps.LatLng(lat, lng),
        	map: newZone.map,
        	animation: google.maps.Animation.BOUNCE
        });
        console.log("done loading");
		
		
        //var drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
	},
}