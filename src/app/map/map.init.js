(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('MapInit', MapInit);

  /** @ngInject */
  function MapInit(
    $window,
    ApiKey,
    $log,
    $q
  ) {
    var doc = $window.document;
    var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=';
    asyncUrl += ApiKey + '&libraries=places&callback=';
    var mapsDefer = $q.defer();

    $window.GMapInitialized = mapsDefer.resolve;

    function asyncLoad(asyncUrl, cbName) {
      $log.log('adding script tag');
      var script = doc.createElement('script');
      script.src = asyncUrl + cbName;
      doc.body.appendChild(script);
    }
    asyncLoad(asyncUrl, 'GMapInitialized');

    var service = {
      initialized: mapsDefer.promise,
      geocoder: geocoder
    };

    function geocoder(Gmap, latLng, onceLocated) {
      var gc = new Gmap.Geocoder;
      gc.geocode({ location: latLng }, geocodeCb);

      function geocodeCb(results, status) {
        if (status === Gmap.GeocoderStatus.OK) {
          if (results[0]) {
            onceLocated(results[0]);
          } else {
            $window.alert('No results found');
          }
        } else {
          $window.alert('Geocoder failed due to: ' + status);
        }
      }
    }

    return service;

  } // MapInit
})();
