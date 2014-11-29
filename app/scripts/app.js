define(['jquery', 'underscore', 'svgloader', 'mapbox', 'modernizr'], function($, _, SVGLoader, Mapbox, Modernizr) {
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
    Mapbox.accessToken = members.options.accessToken;

    // Show the loading screen
    var loader = new SVGLoader(members.elements.loader, { speedIn: 1000, easingIn: mina.easeinout });
    loader.show();

    // Check for geolocation capabilities
    if(Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var map = Mapbox.map('map', members.options.mapID),
            layer = Mapbox.tileLayer(members.options.mapID),
            featureLayer = Mapbox.featureLayer().loadURL('../data/flushots.json').addTo(map);

        map.on('load', function() {
          $(loader.el).hide(); // Hide our loading screen
          $('.marker-list').show();
        });

        // Build marker menu
        map.featureLayer.on('ready', function(e) {
          var markers = [];
          this.eachLayer(function(marker) {
            markers.push(marker);
          });

          buildMarkerList(markers);
        });

        // Check local storage data from previous sessions
        // if it isn't available, set it...
        if(_.isEmpty(localStorage.getItem('latitude')) && _.isEmpty(localStorage.getItem('longitude'))) {
          map.setView([position.coords.latitude, position.coords.longitude], members.options.mapZoomLevel);

          saveToLocalStorage({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
        // ...otherwise, use it
        else {
          map.setView([localStorage.getItem('latitude'), localStorage.getItem('longitude')], members.options.mapZoomLevel);
        }

        var marker = L.marker([position.coords.latitude, position.coords.longitude], {
          icon: Mapbox.marker.icon({
            'marker-color': '#f86767',
            'marker-symbol': 'heart'
          }), draggable: false
        }).addTo(map);
      }, handleGeolocationErrors);
    }
    else {
      var map = Mapbox.map('map', members.options.mapID),
          layer = Mapbox.tileLayer(members.options.mapID);

      map.setView([37.543495, -77.438545], members.options.mapZoomLevel);

      // Ensure our loading screen is visible long enough
      // to finish the start animation
      setTimeout(function() {
        loader.hide();
        $('.marker-list').show();
      }, 1000);
    }
  };

  var saveToLocalStorage = function(items) {
    if(Modernizr.localstorage) {
      _.each(items, function(value, key, list) {
        localStorage.setItem(key, JSON.stringify(value));
      });
    }
  }

  function checkLocalStorage() {
    var archive = [],
    keys = Object.keys(localStorage),
    i = 0;

    for (; i < keys.length; i++) {
      archive.push( localStorage.getItem(keys[i]) );
    }

    return archive;
  }

  var handleGeolocationErrors = function(error) {
    Mapbox.accessToken = members.options.accessToken;

    // Check for errors of any type (network, permission, or failure)
    // and set our center coordinates manually
    if(error.code == 1 || error.code == 2 || error.code == 3) {
      var layer = Mapbox.tileLayer(members.options.mapID);
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
