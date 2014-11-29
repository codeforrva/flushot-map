require.config({
  baseUrl: 'scripts/',
  paths: {
    jquery: ['//code.jquery.com/jquery-1.11.1.min', 'vendor/jquery'],
    underscore: ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min', 'vendor/underscore'],
    mapbox: ['//api.tiles.mapbox.com/mapbox.js/v2.1.4/mapbox', 'vendor/mapbox'],
    classie: 'vendor/classie',
    snap: 'vendor/snap',
    modernizr: 'vendor/modernizr',
    svgloader: 'vendor/svgloader'
  },

  shim: {
    modernizr: {
      exports: "window.Modernizr"
    },
    svgloader: {
      deps: ["snap"],
      exports: "SVGLoader"
    },
    mapbox: {
      exports: "L.mapbox"
    }
  }
});

require(['app'], function(App) {
  App.initialize();
});
