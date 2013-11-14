define([
  // Application.
  "app",
  
  // Module.
  "modules/user"
],

function(app, User) {

	var Footer = app.module();
  
	Footer.Model = Backbone.Model.extend({
		
	});
	
	Footer.Views.Functionsbar = Backbone.View.extend({
		template: "footer/functionsbar",

		events:{
			'click #listview':'showList',
			'click #monthview':'showMonth',
			'click #addLeave':'createLeave',
			'click #queryview':'showQuery'
		},
		
		showQuery: function() {
			console.log("showQuery");
			$("#monthview").removeClass("btn-inverse");
			$("#listview").removeClass("btn-inverse");
			$("#addLeave").removeClass("btn-inverse");
			$("#queryview").addClass("btn-inverse");
			app.router.go("query/search/");
		},
		
		showList: function() {
			console.log("showList");
			$("#monthview").removeClass("btn-inverse");
			$("#listview").addClass("btn-inverse");
			app.router.go("list");
		},	

		showMonth: function() {
			console.log("showMonth");
			$("#monthview").addClass("btn-inverse");
			$("#listview").removeClass("btn-inverse");
			app.router.go("leave");
		},

		createLeave: function() {
			console.log("createLeave...");
			//app.router.navigate("create", true);
			app.router.go("create");
		}

	});
				
	return Footer;

});