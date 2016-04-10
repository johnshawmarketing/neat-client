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
      initialized: mapsDefer.promise
    };

    return service;

  } // MapInit
})();
