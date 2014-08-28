var dashboard = {
	loadZones: function(zones){
		$.each(zones, function(zone, id){
			$.getJSON(handler, {ZID: id, onlyCurrent: true, Mode: 'GetZoneOverview'}, function(returnVal){
				console.log("Zone Name: " + returnVal["Name"]);
				console.log("Crop: " + returnVal["Crop"]);
				
				//populate page with zone data
			    $('#dash_content').append(
			        "<div class='ui-content ui-custom-zone ui-corner-all'>" + 
			            "<div class='zone-body'>" +
				            "<div class='zone-heading'>" +
					            returnVal["Name"] +
					            "<span style='float:right'>" + returnVal["Crop"] + "</span>" + 
				            "</div>" +
			            "</div>" +				            
			        "</div>"
			        )
			    $('#dashboard').trigger('create');
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
          WebView.setWebContentsDebuggingEnabled(true);
        }
			});
		});
	}
}