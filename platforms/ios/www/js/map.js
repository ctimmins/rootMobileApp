var map = {

	loadScript: function(){
		var s = document.createElement("script");
   		s.type = "text/javascript";
   		s.src  = "http://maps.google.com/maps/api/js?v=3&sensor=true&callback=gmap_draw";
   		window.gmap_draw = function(){
       		//map.getCurrentLocation();
       		//map.onSuccess(pos);
       		console.log("maps script loaded");

   		};
   		$("head").append(s);
	},
	
	getCurrentLocation: function(){
		console.log("getting location");
		var myoptions = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
		navigator.geolocation.getCurrentPosition(map.onSuccess, map.onError, myoptions);
	},

	onSuccess: function(pos){
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
			disableDefaultUI: true,
            draggable: false
		}
		console.log("was successful 2");
		map.map = new google.maps.Map($('#map_canvas')[0], mapOptions);
		//map.drawBorder("103452212453f63bd7ed4fb4.72247349");
		google.maps.event.addListener(map.map,'tilesloaded', function(event){
			console.log("tiles have been loaded");
			map.drawBorder("103452212453f63bd7ed4fb4.72247349");
		});
	
	},

	drawBorder: function(zid){
		console.log("drawing border: " + zid);
		$.getJSON(handler, {ZID: zid, onlyCurrent: true, Mode: 'GetZoneOverview'}, function(returnVal){
            if(returnVal["Status"] == "Success"){
                var Border = returnVal["Border"];
                var latLons = Border.split(";");
                var bounds = new google.maps.LatLngBounds();
                var paths = [];
                
                for(var i = 0; i < latLons.length; i++)
                {
                    var latlngsplit = latLons[i].split(",");
                    paths.push(new google.maps.LatLng(latlngsplit[0],latlngsplit[1]));
                    bounds.extend(new google.maps.LatLng(latlngsplit[0],latlngsplit[1]));
                }
                
                var drawingOptions = {
                    paths: paths,
                    strokeColor: '#FFFFFF',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF00FF',
                    fillOpacity: 0.35
                };

                var shape = new google.maps.Polygon(drawingOptions);

                shape.setMap(map.map);
                google.maps.event.trigger(map, "resize");
                map.map.fitBounds(bounds);
            }
            else
                console.log("unsuccessful json request");    
        });
	},

	onError: function(error){
		alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	}
}