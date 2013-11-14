define([
  // Application.
  "app",

  // Modules.
  "modules/login",
  "modules/user",
  "modules/leave",
  "modules/footer"
],

function(app, Login, User, LeaveEvent, Footer) {

  var currentDate;

  var collections = {
    // Set up the users.
    users: new User.Collection(),
    leaveobjs: new LeaveEvent.Collection(),
    queryobjs: new LeaveEvent.Collection(),
    leaveobj: new Object,
  };

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    initialize: function() {
      console.log("router initialize");
      
      app.currentDate = new Date();
      console.log("currentDate is: "+ currentDate);

      // TODO Clean this up...
      /* 
      var collections = {
        // Set up the users.
        users: new User.Collection(),
        loginForm: new Login.Views.loginForm(),
      };
      // Ensure the router has references to the collections.
      _.extend(this, collections);*/
     
      // Use main layout and set Views.
      app.useLayout("main-layout").setViews({
        ".functionsbar":new Footer.Views.Functionsbar()
      }).render();

      console.log("router initialize finished");
    },

    routes: {
      //"": "index",
      "": "login",
      "leave": "monthView",
      "list": "listView",
      "create": "createView",
      "query/search/":"queryView",
      "query/statistic/":"statisticView"
    },

    index: function() {
      // Reset the state and render.
      console.log("router index");

      // this.reset();
      //this.leaveobjs.setUrl();
     // this.leaveobjs.fetch();
    },

    login: function() {
      // Reset the state and render.
      console.log("login ...");

      // set loginForm view to main-layout
      var collections = {
        // Set up the users.
        users: new User.Collection(),
        loginForm: new Login.Views.loginForm(),
      };
      // Ensure the router has references to the collections.
      _.extend(this, collections);

      console.log("set loginForm view at login function ...");

      // Use main layout and set loginForm Views.
      app.useLayout("main-layout").setViews({
        //".users": new User.Views.List(collections),
        ".leave-event-panel": this.loginForm
      }).render();

      this.loginForm.on("loginSuccess",function(){
        console.log("login success this on.");
        //app.router.navigate("leave", true);
        app.router.go("leave");
        console.log("login success monthView this on.");
      });

      this.loginForm.on("loginFail",function(){
        console.log("login Fail this on.");
        //app.router.navigate("leave", true);
        app.router.go("leave");
        console.log("login monthView this on.");
      });

    },

    createView: function() {

      console.log("create ...");
      app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.Create(collections)).render();
      $(".functionsbar").hide();
    },

    monthView: function() {
      // Reset the state and render.
      console.log("router monthView");
     
      app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.Month(collections));

      var MONGOLAB_KEY = "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11";
      var MONGOLAB_URL = "https://api.mongolab.com/api/1/databases/calendar/collections/events/";
      
      if(!collections.leaveobjs.length)        
      {
        collections.leaveobjs.setUrl(MONGOLAB_URL+MONGOLAB_KEY);
        collections.leaveobjs.fetch();
      }
      else
      {
        console.log(collections.leaveobjs.length);
        app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.Month(collections)).render();
      }      
    },

    listView: function() {
      // Reset the state and render.
      console.log("router listView");

      app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.List(collections));

      // this.reset();
      var MONGOLAB_KEY = "?apiKey=uIPdv1LT9_YA7Bd84BnBfKGhjA5IVW11";
      var MONGOLAB_URL = "https://api.mongolab.com/api/1/databases/calendar/collections/events/";
      
      if(!collections.leaveobjs.length)        
      {
        collections.leaveobjs.setUrl(MONGOLAB_URL+MONGOLAB_KEY);
        collections.leaveobjs.fetch();
      }
      else
      {
        console.log(collections.leaveobjs.length); 
        app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.List(collections)).render();
      }   
    },

    queryView: function() {
      // Reset the state and render.
      console.log("router query/search/");
      app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.Query(collections)).render();

    },

    statisticView: function() {
      // Reset the state and render.
      console.log("router query/statistic/");
      app.useLayout("main-layout").setView(".leave-event-panel", new LeaveEvent.Views.Query(collections)).render();


    },

    user: function(org, name) {
      console.log("router user");
      // Reset the state and render.
      this.reset();

      // Set the organization.
      this.users.org = org;

      // Fetch the data.
      this.users.fetch();
      
      console.log("router user finished");
    },

    // Shortcut for building a url.
    go: function() {
      console.log("router go");
      return this.navigate(_.toArray(arguments).join("/"), true);
      console.log("router go finished");
    },

    reset: function() {
      console.log("router reset");
      // Reset collections to initial state.
      if (this.users.length) {
        this.users.reset();
      }

      // Reset active model.
      app.active = false;
      console.log("router reset finished");
    }
  });

  // Required, return the module for AMD compliance.
  return Router;

});
