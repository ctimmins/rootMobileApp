var zone = {
	loadZoneDetails: function(id)
    {
        console.log("ZID: " + id);
        
        $.getJSON(handler,{ZID: id, onlyCurrentFull: true, Mode: 'GetZoneOverview'}, function(returnVal)
        {
            if(returnVal["Status"] == "Fail")
                window.location = "login.html";
                
            var zone_details = returnVal,
                status = zone_details["Status"],
                name = zone_details["Name"],
                crop = zone_details["Crop"],
                data = zone_details["Data"],
                crop_status = zone_details["Status"],
                Border = zone_details["Border"], 
                Lat = zone_details["Latitude"], 
                Long = zone_details["Longitude"];
                
            var mapNum = id.replace('.','');
            

            //initialize custom-body
            var custombody = '<div class="row"><div class="col-md-7 col-xs-12">';

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
                        
                        if(bar_progress > 30)
                        {
                            crop_item = ([key,
                                            '<div class="progress zone-progress" style="background: #f5f5f5;">',
                                            '   <div class="progress-bar progress-bar-' + detail_status + ' zone-progress-bar" role="progressbar" aria-valuenow="' + detail_value + '" aria-valuemin="' +  bar_min_value + '0" aria-valuemax="' + bar_max_value + '" style="width: ' + bar_progress + '%">',
                                            '      <div class="phoneHeader"><p style="color:#FFF">' + detail_value + ' ' + detail_units + '</p></div>',
                                            '   </div>',
                                            '</div>'].join(""));
                        }
                        else
                        {
                            crop_item = ([key,
                                        '<div class="progress zone-progress" style="background: #f5f5f5;">',
                                        '   <div class="progress-bar progress-bar-' + detail_status + ' zone-progress-bar" role="progressbar" aria-valuenow="' + detail_value + '" aria-valuemin="' +  bar_min_value + '0" aria-valuemax="' + bar_max_value + '" style="width: ' + bar_progress + '%">',
                                        '   <div style="position:absolute;width:100%;text-align:center;" class="phoneHeader"><p  style="color:#000">' + detail_value + ' ' + detail_units + '</p></div>',
                                        '   </div>',
                                        '</div>'].join(""));
                        }
                        custombody+=crop_item;
                    }
                });
            });

            // close custom body div (remove one of the closing divs when thumbnail becomes active)
            custombody+='</div>';

            //build panel
            var zonepanel = $([ '<div class="panel panel-' + crop_status + ' zone-panel">',
                                        '       <div style="padding:20px">' + custombody,                                                    
                                        '       </div>',
                                        '</div>'].join(""));
            
            $("#detail_title").text(name + " | " + crop);
            $("#details_content").append(zonepanel);
            $('#details').trigger('create');
        });
    }
};