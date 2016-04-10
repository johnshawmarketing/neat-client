(function() {
  'use strict';

  angular
    .module('neatClient')
    .directive('neatMap', neatMap);

  /** @ngInject */
  function neatMap() {
    var directive = {
      restrict: 'E',
      scope: {
        temp: '='
      },
      templateUrl: 'app/components/neatmap/map.html',
      link: linkFunc,
      controller: NeatMapController,
      controllerAs: 'mp'
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
    } // link

    /** @ngInject */
    function NeatMapController(
      $window,
      MapDialog,
      MapInit
    ) {
      var vm = this;
      var doc = $window.document;
      var Gmap;
      var neatMap;
      var mapEl;

      vm.showAdd = MapDialog.showAdd;

      activate();

      function activate() {
        mapEl = doc.getElementById('map');
        MapInit.initialized.then(setupMap);
      }

      function setupMap() {
        Gmap = $window.google.maps;
        neatMap = getMap({
          center: {lat: 44.4120908, lng: -79.6701331},
          zoom: 14
        });

        var icon = {
          url: '../assets/images/garbage-red.svg',
          anchor: new Gmap.Point(28, 28)
        };

        var m1 = marker({
          position: {lat: 44.406613, lng: -79.668722},
          icon: icon
        });
      }

      function getMap(config) {
        return new Gmap.Map(mapEl, config);
      }

      function marker(options) {
        options.map = neatMap;
        return new Gmap.Marker(options);
      }

    } // controller

  } // directive

})();
