/*  js/main.js  */

require.config({

	baseUrl: "js",

	paths: {
		backbone: "lib/backbone/backbone-1.1.2",
		jquery: "lib/jquery/jquery-1.10.1",
		jqm: "lib/jquery/jquery.mobile-1.4.3.min",
		underscore: "lib/underscore/underscore-1.6.0",
		fastclick: "lib/fastclick/fastclick-1.0.3",
		text: "lib/require/text",
		templates: "../templates"
	},

	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		}
	}
});

require(['app','jquery','jqm'], function(App){
	//$.mobile.linkBindingEnabled = false;
	//$.mobile.hashListeningEnabled = false;
	console.log("got to main init")
	App.initialize();

})