define([
  // Application.
  "app"
],

function(app) {

  var User = app.module();

  User.Collection = Backbone.Collection.extend({
    url: function() {
      console.log("user getdata");
      return "https://api.github.com/orgs/" + this.org + "/members?callback=?";
    },

    cache: true,

    parse: function(obj) {
      // Safety check ensuring only valid data is used.
      if (obj.data.message !== "Not Found") {
        this.status = "valid";
        console.log("obj.data parse" + obj.data);
        return obj.data;
      }

      this.status = "invalid";
      console.log("obj parse" + obj);
      return obj;
    },

    initialize: function(models, options) {
      if (options) {
        console.log("user-collection initialize if");
        this.org = options.org;
      }
      console.log("user-collection initialize");
    }
  });

  User.Views.Item = Backbone.View.extend({
    template: "user/item",

    tagName: "li",

    serialize: function() {
      console.log("user-views-item serialize");
      return {         
        model: this.model };
    },

    initialize: function() {
      console.log("user-views-item initialize");
      this.listenTo(this.model, "change", this.render);
    }
  });

  User.Views.List = Backbone.View.extend({
    template: "user/list",

    serialize: function() {
      console.log("user-views-list serialize");
      return { 
        collection: this.options.users };
    },

    beforeRender: function() {
      console.log("user-views-list beforeRender");
      this.options.users.each(function(user) {
        this.insertView("ul", new User.Views.Item({
          model: user
        }));
      }, this);
    },

    afterRender: function() {
      // Only re-focus if invalid.
      console.log("user-views-list afterRender");
      this.$("input.invalid").focus();
    },

    initialize: function() {
      console.log("user-views-list initialize");
      this.listenTo(this.options.users, {
        "reset": this.render,

        "fetch": function() {
          console.log("user fetch listened");
          this.$("ul").parent().html("<img src='/app/img/spinner-gray.gif'>");
        }
      });
    },

    events: {
      "submit form": "updateOrg"
    },

    updateOrg: function(ev) {
      app.router.go("org", this.$(".org").val());

      return false;
    }
  });

  // Required, return the module for AMD compliance.
  return User;

});
