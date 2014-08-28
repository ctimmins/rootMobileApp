define(function(require){

	var $        = require('jquery'),
		Backbone = require('backbone'),
		HomeView = require('app/views/Home');

	var homeView = new HomeView;

	return Backbone.Router.extend({

		routes: {
			"": "home"
		}

		home: function(){
			homeView.delegateEvents();
		}
	});
});