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
      $log,
      $mdDialog,
      $timeout,
      MapData,
      mapIcons,
      MapInit
    ) {
      var vm = this;
      var doc = $window.document;
      var Gmap;
      var neatMap;
      var mapEl;

      activate();

      function activate() {
        mapEl = byId('map');
        MapInit.initialized
          .then(setupMap)
          .then(setupControls);
        getTypes().then(function() {
          $log.info('Loaded types');
        });
      }

      /////////////////////////////////
      // Google Map Setup
      // /////////////////////////////
      function setupMap() {
        Gmap = $window.google.maps;
        neatMap = getMap({
          center: {lat: 44.4120908, lng: -79.6701331},
          zoom: 14
        });

        var m1 = marker({
          position: {lat: 44.406613, lng: -79.668722},
          icon: mapIcons('garbage', 5, Gmap)
        });

        return neatMap;
      }

      /*
       * Map helpers
       */
      function getMap(config) {
        return new Gmap.Map(mapEl, config);
      }

      function marker(options) {
        options.map = neatMap;
        return new Gmap.Marker(options);
      }

      /////////////////////////////////
      // GET
      // /////////////////////////////
      function getTypes() {
        return MapData.getTypes()
          .then(function(data) {
            vm.types = data;
            return vm.types;
          });
      }

      /////////////////////////////////
      // Dialog setup
      // /////////////////////////////
      function setupControls() {
        vm.showAdd = showAdd;
      }

      function showAdd(ev, markers) {
        $mdDialog.show({
          controller: AddDialogController,
          templateUrl: 'app/components/neatmap/marker_add.dialog.html',
          parent: angular.element(doc.body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
      } // showAdd

      function AddDialogController($scope, $mdDialog) {
        $timeout(addPlaceSearch);

        function addPlaceSearch() {
          var input = byId('address');
          var searchBox = new Gmap.places.SearchBox(input);

          neatMap.addListener('bounds_changed', function() {
            // $log.log('bounds set');
            searchBox.setBounds(neatMap.getBounds());
          });

          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length === 0) return;
            var place = places[0];
            $scope.name = place.name;
            $scope.address = place.formatted_address;
            $scope.long = place.geometry.location.lng();
            $scope.lat = place.geometry.location.lat();
          });
        }

        $scope.types = vm.types;

        $scope.severity = 3;

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.add = function() {
          $log.log('name:', $scope.name);
          $log.log('address:', $scope.address);
          $log.log('long:', $scope.long);
          $log.log('lat:', $scope.lat);
          $log.log('chosenType:', $scope.chosenType);
          $log.log('description:', $scope.description);
          $log.log('severity:', $scope.severity);
          $mdDialog.hide();
        };
      } // dialogCtrl

      function byId(id) {
        return doc.getElementById(id);
      }

    } // controller

  } // directive

})();
