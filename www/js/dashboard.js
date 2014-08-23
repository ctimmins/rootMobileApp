var dashboard = {
	loadZones: function(zones){
		$.each(zones, function(zone, id){
			$.getJSON(handler, {ZID: id, onlyCurrent: true, Mode: 'GetZoneOverview'}, function(returnVal){
				console.log("Zone Name: " + returnVal["Name"]);
				console.log("Crop: " + returnVal["Crop"]);
				
				//populate page with zone data
			    $('#dashboard').append(
			        "<div data-role='collapsible' data-mini='true'>" + 
			            "<h2>" + returnVal["Name"] + "</h2>" +
			            "<p>" + returnVal["Crop"] + "</p>" +
			        "</div>"
			        )
			    $('#dashboard').trigger('create');
			});
		});
	}
}