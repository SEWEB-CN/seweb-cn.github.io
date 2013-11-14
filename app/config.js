// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ["../vendor/jam/require.config", "main"],

  paths: {
    // Use the underscore build of Lo-Dash to minimize incompatibilities.
    "lodash": "../vendor/jam/lodash/lodash.underscore",

    // Use the fullcalendar plugin to display the calendar part.
    // "fullcalendar": "../vendor/jam/fullcalendar/fullcalendar",

    // JavaScript folders.
    plugins: "../vendor/js/plugins",
    vendor: "../vendor"
  },

  map: {
    // Ensure Lo-Dash is used instead of underscore.
    "*": { "underscore": "lodash" }

    // Put additional maps here.
  },

  shim: {
    // Backbone.CollectionCache depends on Backbone.
    "plugins/backbone.collectioncache": ["backbone"],

    // Twitter Bootstrap depends on jQuery.
    "vendor/bootstrap/js/bootstrap": ["jquery"],
    
    // add for datepicker and dropdown list
    "vendor/bootstrap/js/bootstrap-datepicker": ["jquery"],
    "vendor/bootstrap/js/bootstrap-select.min": ["jquery"],
    
    // include jquery.md5 and use jquery.md5 at sample
    "vendor/md5/jquery.md5": ["jquery"],

    // fullcalendar depends on jQuery.
    // "vendor/jam/fullcalendar/fullcalendar": ["jquery"]
  }

});
