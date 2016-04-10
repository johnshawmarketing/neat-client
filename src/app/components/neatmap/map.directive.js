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
      var nav = $window.navigator;
      var markers = [];
      var records = [];
      var Gmap;
      var neatMap;
      var mapEl;
      var geocoder;

      activate();

      function activate() {
        mapEl = byId('map');
        MapInit.initialized
          .then(setupMap)
          .then(setupControls);
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

        geocoder = new Gmap.Geocoder;

        getTypes();
        return getRecords().then(assignRecordsToMarkers);
      }

      /*
       * Map helpers
       */
      function byId(id) {
        return doc.getElementById(id);
      }

      function assignRecordsToMarkers(records) {
        records.forEach(function(record) {
          var local  = record.Location;
          var marker =
            magicSteveMarkerr(local.latitude, local.longitude, record);
        });
        return records;
      }
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
            vm.types = data.reduce(typeArrayToMap, {});
            return vm.types;
          });

        function typeArrayToMap(prev, curr) {
          prev[curr.id] = curr.name.replace(' ', '-');
          return prev;
        }
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
        var ad = $scope;
        $timeout(addPlaceSearch);

        ad.types = vm.types;
        ad.severity = 3;
        ad.cancel = cancel;
        ad.add = add;
        ad.locateCurrent = locateCurrent;

        function addPlaceSearch() {
          var input = byId('address');
          var searchBox = new Gmap.places.SearchBox(input);

          neatMap.addListener('bounds_changed', function() {
            searchBox.setBounds(neatMap.getBounds());
          });

          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length === 0) return;
            var place = places[0];
            ad.address = place.name;
            ad.long = place.geometry.location.lng();
            ad.lat = place.geometry.location.lat();
          });
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function add() {
          MapData.createRecord({
            long: ad.long,
            lat: ad.lat,
            address: ad.address,
            description: ad.description,
            severity: ad.severity,
            user_id: $rootScope.user.id,
            type_id: ad.typeId
          }).then(function(data) {
            var record = data.record;
            magicSteveMarkerr(ad.lat, ad.long, record, true);
          });
          $mdDialog.hide();
        }

        function locateCurrent() {
          ad.address = 'Locating...';
          if (nav.geolocation) {
            nav.geolocation.getCurrentPosition(function(pos) {
              ad.lat = pos.coords.latitude;
              ad.long = pos.coords.longitude;
              geocoder.geocode({
                location: { lat: ad.lat, lng: ad.long }
              }, function(results, status) {
                if (status === Gmap.GeocoderStatus.OK) {
                  if (results[1]) {
                    ad.address = results[1].formatted_address;
                    ad.$apply();
                  } else {
                    $window.alert('No results found');
                  }
                } else {
                  $window.alert('Geocoder failed due to: ' + status);
                }
              });
            });
          } else {
            $log.error('Browser does not support goelocation');
          }
        }
      } // dialogCtrl

    } // controller

  } // directive

})();
