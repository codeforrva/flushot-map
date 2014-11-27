
(function () {
  'use strict';

  window.App = {
    dom: {
      loader: document.getElementById('loader'),
      markerList: $('.marker-list')
    },

    options: {
      accessToken: 'pk.eyJ1Ijoiam9leWZpZ2FybyIsImEiOiJoelEwUS1ZIn0.A-DeRFvp3ca1bC-LZBPRVw',
      mapID: 'joeyfigaro.kamo7g7d'
    },

    mapConfig: {
    	zoomLevel: 15
    },

    // Used to iterate over markers
    buildMarkerList: function(markers) {
      (function run() {
        for(var i = 0; i < markers.length; i++) {
          App.dom.markerList.append('<li><a href="#" data-lat="' + markers[i]._latlng.lat + '" data-long="' + markers[i]._latlng.lng + '">' + markers[i].feature.properties.description + '</a></li>');
        }
      })();
    },

    showNotification: function(note, type) {
			var notification = new NotificationFx({
				message: note,
				layout: 'growl',
				effect: 'jelly',
				type: type // notice, warning, error or success
			});

			// show the notification
			notification.show();
    },

    generateMap: function() {
      L.mapbox.accessToken = App.options.accessToken;

      // Show the loading screen
      var loader = new SVGLoader(App.dom.loader, { speedIn: 400, easingIn: mina.easeinout });
      loader.show();

		  navigator.geolocation.getCurrentPosition(function(position) {
  		  var map = L.mapbox.map('map', App.options.mapID),
            layer = L.mapbox.tileLayer(App.options.mapID),
            featureLayer = L.mapbox.featureLayer().loadURL('../data/flushots.json').addTo(map);

        // Build marker menu
        map.featureLayer.on('ready', function(e) {
          var markers = [];
          this.eachLayer(function(marker) { markers.push(marker); });

          App.buildMarkerList(markers);
        });

        // Center the map on the location of the user
        map.setView([position.coords.latitude, position.coords.longitude], App.mapConfig.zoomLevel);

        // Ensure our loading screen is visible long enough
        // to finish the start animation
        setTimeout(function() {
          loader.hide();
          $('.cfa-logo').show();
        }, 1000);

        var marker = L.marker([position.coords.latitude, position.coords.longitude], {
          icon: L.mapbox.marker.icon({
            'marker-color': '#f86767',
            'marker-symbol': 'heart'
          }), draggable: false
        }).addTo(map);

      }, App.handleGeolocationErrors);
	  },

	  handleGeolocationErrors: function(error) {
  	  L.mapbox.accessToken = App.options.accessToken;

  	  // Check for errors of any type (network, permission, or failure)
  	  // and set our center coordinates manually
      if(error.code == 1 || error.code == 2 || error.code == 3) {
			  var layer = L.mapbox.tileLayer(App.options.mapID);

        map.setView([37.543495, -77.438545], App.mapConfig.zoomLevel);
      }

      // position unavailable
      if(error.code == 2) {
        App.showNotification('Current position is not available.', 'error');
      }

      // network timeout
      if(error.code == 3) {
        App.showNotification('Current position is not available due to network connectivity.', 'warning');
      }
	  }
  };

  window.onload = App.generateMap;
})();


