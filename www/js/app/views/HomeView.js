define(function(require){

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		homeTemplate = require('text!templates/homeTemplate.html');

	var compiledTemplate = _.template(homeTemplate);

	return Backbone.View.extend({

		initialize: function(){
			this.render();
		},

		render: function(){
			this.$el.html(compiledTemplate);
		}
	}); 
});