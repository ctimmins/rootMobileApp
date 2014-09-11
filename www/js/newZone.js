var newZone = {

	initialize: function(){
		
		//when 'Next' is clicked
		$('#next_button').on("touchstart", function(e){
			var zoneName = $('#zone_name').val();
			var cropName = $('#crop_name').val();
			var location = $('#new_zone_address').val();
			console.log(zoneName);
			console.log(cropName);
			console.log(location);
		});
	},
}