define([
  // Application.
  "app"
  // "vendor/jam/fullcalendar/fullcalendar"
],

function(app) {

	var Login = app.module();

  	Login.Model = Backbone.Model.extend({

	});

	Login.Views.loginForm = Backbone.View.extend({
		template: "login/loginForm",

		initialize: function() {
		  console.log("login loginForm initialize");
		  //this.listenTo(this.model, "change", this.render);
		},

		events:{
			'click #login':'login'
		},

		login: function() {

	    var self = this;

	    //set url and key for mongo database
	    var api_url = "";
      var api_key = "";

      var MONGOHQ_URL = "https://api.mongohq.com/databases/calendar/collections/";
      var MONGOHQ_KEY = "?_apikey=lLldnqL9KWLTLBGCfUNkJYF1m8JLVckXEsBzySFc";

      var MONGOLAB_URL = "https://api.mongolab.com/api/1/databases/calendar/collections/users";
      var MONGOLAB_KEY = "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11";
    	
      api_url = MONGOLAB_URL;
      api_key = MONGOLAB_KEY;    	

      var TOKEN = "MLC";

	    console.log("start login access check");
          
      var username = $('#username').val();
      var password = $('#password').val();

      //todo add data check before submit example: start with sesa...
      var checkResult = true;
      if (username.length <= 0) {
        $('#username').addClass( "errorInput" );
        checkResult = false;
      };

      if (password.length <= 0) {
        $('#password').addClass( "errorInput" );
        checkResult = false;
      };

      if(!checkResult){
        //todo display error message at model popup
        return false;
      }

      //create encryptPWD
      var encryptPWD = $.md5(username+TOKEN+password);

      console.log(encryptPWD);

      //get userDetails with username and password token
      //var queryStr = "{'userid':'"+username+"','password':'"+ encryptPWD+"'}";
      var queryStr = JSON.stringify( {"userid":username,"password":encryptPWD} );
              
      $.ajax({
          type: "GET",
          url: api_url+api_key+"&q="+queryStr
        }).done(function(data){
          //handle user detail
          //app.user = new User.Model(data);
          console.log(data[0]);
         
          $.each(data,function(index,user){
            	//create span for user
              console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
              console.log("user.userid:"+user.userid);
              console.log("user.username:"+user.username);
              console.log("user.location:"+user.location);
              console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

              //todo handle user detail
              //app.user = new User.Model(data);
          });
          
          self.trigger("loginSuccess");

        }).fail(function(xhr, status,err){
            console.log("login fail");
            self.trigger("loginFail");

        })
		}
	});
	// Required, return the module for AMD compliance.
	return Login;
});