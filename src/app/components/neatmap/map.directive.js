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
      $rootScope,
      MapInit
    ) {
      var vm = this;
      var doc = $window.document;
      var Gmap;
      var neatMap;
      var mapEl;

      var markers = [];
      var records = [];

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
        neatMap = new Gmap.Map(mapEl, {
          center: {lat: 44.4120908, lng: -79.6701331},
          zoom: 15
        });

        return getRecords().then(function(records) {
          records.forEach(function(record) {
            var local  = record.Location;
            var marker = magicSteveMarkerr(
              local.latitude,
              local.longitude,
              record
            );
          });
          return records;
        });
      }

      /*
       * Map helpers
       */
      function magicSteveMarkerr(lat, lng, record, animate) {
        var options = {
          position: { lat: lat, lng: lng },
          icon: mapIcons(vm.types[record.TypeId], record.severity, Gmap),
          map: neatMap,
          myRecord: record
        };

        if (animate) {
          options.animation = Gmap.Animation.DROP;
        }

        var marker = new Gmap.Marker(options);
        attachMarkerEvent(marker);
        records.push(record);
        markers.push(marker);

        return marker;
      }

      function attachMarkerEvent(marker) {
        marker.addListener('click', function(e) {
          console.log('this my rec idx:', records.indexOf(this.myRecord));
          console.log('this my idx:', markers.indexOf(this));
        });
      }

      /////////////////////////////////
      // GET
      // /////////////////////////////
      function getTypes() {
        return MapData.getTypes()
          .then(function(data) {
            vm.types = data.reduce(function(prev, curr) {
              prev[curr.id] = curr.name.replace(' ', '-');
              return prev;
            }, {});
            console.log(vm.types);
            return vm.types;
          });
      }

      function getRecords() {
        return MapData.getRecords()
          .then(function(data) {
            records = data;
            return records;
          });
      }

      /////////////////////////////////
      // Dialog setup
      // /////////////////////////////
      function setupControls() {
        vm.showAdd = showAdd;
      }

      function showAdd(ev) {
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
            $scope.address = place.name;
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
          MapData.createRecord({
            long: $scope.long,
            lat: $scope.lat,
            address: $scope.address,
            description: $scope.description,
            severity: $scope.severity,
            user_id: $rootScope.user.id,
            type_id: $scope.typeId
          }).then(function(data) {
            var record = data.record;
            magicSteveMarkerr($scope.lat, $scope.long, record, true);
            $log.log('added record:', record);
          });
          $mdDialog.hide();
        };
      } // dialogCtrl

      function byId(id) {
        return doc.getElementById(id);
      }

    } // controller

  } // directive

})();
