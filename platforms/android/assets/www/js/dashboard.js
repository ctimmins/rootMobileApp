var dashboard = {
	loadZones: function(zones){
        $('#dash_content').empty();
		$.each(zones, function(zone, id){
			$.getJSON(handler, {ZID: id, onlyCurrent: true, Mode: 'GetZoneOverview'}, function(returnVal){
				console.log("Zone Name: " + returnVal["Name"]);
				console.log("Crop: " + returnVal["Crop"]);
                
                var zone_details = returnVal,
                    status = zone_details["Status"],
                    name = zone_details["Name"],
                    crop = zone_details["Crop"],
                    data = zone_details["Data"],
                    crop_status = zone_details["Status"],
                    Border = zone_details["Border"], 
                    Lat = zone_details["Latitude"], 
                    Long = zone_details["Longitude"];
                    
                //initialize custom-body
                var custombody = "";

                //build custom body
                $.each(data, function(key, value)
                {
                    $.each(value, function(type, value)
                    {
                        if(type == "Historical")
                        {
                            var detail_type = key,
                                detail_value = value.CurrentValue,
                                detail_units = value.Units.Unit,
                                bar_max_value = value.Units.Max,
                                bar_min_value = value.Units.Min,
                                detail_status = value.Status,
                                bar_range = bar_max_value - bar_min_value,
                                cur_value = parseInt(value.CurrentValue),
                                bar_progress = cur_value*100/bar_range;
                                
                                if(detail_units == " Inches per Hour")
                                    detail_units = " in.";
                            
                            crop_item = (["<div style='width:33.333%;float:left;'>",
                                            "<div style='padding-bottom:10px;font-weight:500;font-size:.7em;text-align:center'>" + key + "</div>",
                                            "<div style='font-weight:900;text-align:center;font-size:1.5em'>" + detail_value + 
                                                "<p style='font-weight:300;font-size:1em;display: inline;'>",
                                                    detail_units,
                                                "</p>",
                                            "</div>",
                                          "</div>",
                                         ].join(""));

                            custombody+=crop_item;
                        }
                    });
                });
				
				//populate page with zone data
			    $('#dash_content').append(
			        "<div class='ui-content ui-custom-zone ui-corner-all'>" + 
			            "<div class='zone-body'>" +
				            "<div class='zone-heading' style='font-weight:700;height:22px;margin-bottom:10px;background-color:rgba(255, 255, 255, 0.3);'>" +
                                "<span style='float:left;width:48%;text-align:center;'>" + returnVal["Name"] + "</span>" +
                                "<span style='float:left;width:4%;text-align:center;'> | </span>" +
					            "<span style='float:left;width:48%;text-align:center;'>" + returnVal["Crop"] + "</span>" + 
				            "</div>" +
                            "<div>" +
                                custombody +
                            "</div>" +
                        "</div>" +
			        "</div>"
			        )
			    $('#dashboard').trigger('create');
			});
		});
	}
}