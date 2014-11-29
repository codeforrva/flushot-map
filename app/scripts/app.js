define(['jquery', 'underscore', 'svgloader', 'mapbox', 'modernizr'], function($, _, SVGLoader, mapbox) {
  var members = {
    elements: {
      loader: document.getElementById('loader'),
      markerList: $('.marker-list')
    },

    options: {
      accessToken: 'pk.eyJ1Ijoiam9leWZpZ2FybyIsImEiOiJoelEwUS1ZIn0.A-DeRFvp3ca1bC-LZBPRVw',
      mapID: 'joeyfigaro.kamo7g7d',
      mapZoomLevel: 15
    }
  };

  var initialize = function() {
    mapbox.accessToken = members.options.accessToken;

    // Show the loading screen
    var loader = new SVGLoader(members.elements.loader, { speedIn: 400, easingIn: mina.easeinout });
    loader.show();

    navigator.geolocation.getCurrentPosition(function(position) {
      var map = mapbox.map('map', members.options.mapID),
      layer = mapbox.tileLayer(members.options.mapID);
      // featureLayer = L.mapbox.featureLayer().loadURL('../data/flushots.json').addTo(map);

      // Build marker menu
      map.featureLayer.on('ready', function(e) {
        var markers = [];
        this.eachLayer(function(marker) { markers.push(marker); });

        buildMarkerList(markers);
      });

      // Center the map on the location of the user
      map.setView([position.coords.latitude, position.coords.longitude], members.options.mapZoomLevel);

      // Ensure our loading screen is visible long enough
      // to finish the start animation
      setTimeout(function() {
        loader.hide();
        $('.marker-list').show();
      }, 1000);

      var marker = L.marker([position.coords.latitude, position.coords.longitude], {
        icon: mapbox.marker.icon({
          'marker-color': '#f86767',
          'marker-symbol': 'heart'
        }), draggable: false
      }).addTo(map);
    }, handleGeolocationErrors);
  };

  var handleGeolocationErrors = function(error) {
    mapbox.accessToken = members.options.accessToken;

    // Check for errors of any type (network, permission, or failure)
    // and set our center coordinates manually
    if(error.code == 1 || error.code == 2 || error.code == 3) {
      var layer = mapbox.tileLayer(members.options.mapID);
      map.setView([37.543495, -77.438545], members.mapConfig.mapZoomLevel);
    }

    // position unavailable
    if(error.code == 2) {
      showNotification('Current position is not available.', 'error');
    }

    // network timeout
    if(error.code == 3) {
      showNotification('Current position is not available due to network connectivity.', 'warning');
    }
  };

  var buildMarkerList = function(markers) {
    for(var i = 0; i < markers.length; i++) {
      members.elements.markerList.append('<li><a href="#" data-lat="' + markers[i]._latlng.lat + '" data-long="' + markers[i]._latlng.lng + '">' + markers[i].feature.properties.description + '</a></li>');
    }
  };

  var showNotification = function(note, type) {
    var notification = new NotificationFx({
      message: note,
      layout: 'growl',
      effect: 'jelly',
      type: type // notice, warning, error or success
    });

    // show the notification
    notification.show();
  };

  return {
    // Public Properties
    members: members,

    // Public Methods
    initialize: initialize,
    buildMarkerList: buildMarkerList,
    showNotification: showNotification,
  };
});
