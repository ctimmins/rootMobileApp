define(function(require){

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		homeTemplate = require('text!templates/homeTemplate.html');

	var compiledTemplate = _.template(homeTemplate);

	return Backbone.View.extend({

		initialize: function(){
			console.log("got to View init");
			this.render();
		},

		render: function(){
			console.log("got to view render");
			this.$el.html(compiledTemplate());
		}
	}); 
});