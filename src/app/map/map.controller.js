(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('MapController', MapController);

  /** @ngInject */
  function MapController(
    byId,
    MapData,
    MapDialog,
    mapIcons,
    MapInit,
    $mdDialog,
    $mdSidenav,
    $scope,
    $window
  ) {
    var vm = this;
    var markers = [];
    var Gmap;
    var neatMap;
    var mapEl;
    var clearing = false; // for filterSeverity watch

    vm.toggleSideMenu = toggleSideMenu;
    vm.filterUpdate = filterUpdate;
    vm.filterClearAll = filterClearAll;

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

      neatMap.addListener('click', function(ev) {
        console.log(ev);
        var geocoder = new Gmap.Geocoder;
        geocoder.geocode({
          location: ev.latLng
        }, function(results, status) {
          var result = results[0];
          if (status === Gmap.GeocoderStatus.OK) {
            if (result) {
              var lat = ev.latLng.lat();
              var lng = ev.latLng.lng();
              var record = {
                Location: {
                  address: result.formatted_address,
                  latitude: lat,
                  longitude: lng
                },
                severity: 3
              };
              var marker = magicMarker(lat, lng, record, true, true);
              setTimeout(function() {
                MapDialog.confirmDelete(ev, marker, markers);
              }, 2000);
            } else {
              $window.alert('No results found');
            }
          } else {
            $window.alert('Geocoder failed due to: ' + status);
          }
        });
      });

      return getTypes()
        .then(getRecords)
        .then(assignRecordsToMarkers);
    }

    /*
     * Map helpers
     */
    function assignRecordsToMarkers(records) {
      records.forEach(function(record) {
        var local  = record.Location;
        magicMarker(local.latitude, local.longitude, record);
      });
      return records;
    }

    function magicMarker(lat, lng, record, animate, tbd) {
      var type = tbd ? 'placeholder' : vm.types[record.TypeId];
      var options = {
        position: { lat: lat, lng: lng },
        icon: mapIcons(type, record.severity, Gmap),
        map: neatMap,
        myRecord: record
      };

      if (animate) {
        options.animation = Gmap.Animation.DROP;
      }

      var marker = new Gmap.Marker(options);
      attachMarkerEvent(marker);
      markers.push(marker);

      return marker;
    }

    function clearMarkers() {
      markers.forEach(function loopMarkers(marker) {
        marker.setMap(null);
      });

      markers = [];
    }

    function attachMarkerEvent(marker) {
      marker.addListener('click', function() {
        var self = this;

        // on click create a new info window with record content
        var infowindow = new Gmap.InfoWindow({
          content: MapDialog.createInfoContent(self.myRecord)
        });

        // add click listener to info window buttons
        infowindow.addListener('domready', function() {
          var editBtn = byId('edit-record-btn');
          var delBtn = byId('del-record-btn');

          editBtn.addEventListener('click', function(ev) {
            vm.showDialog(ev, self, infowindow, markers);
          });

          delBtn.addEventListener('click', function(ev) {
            MapDialog.confirmDelete(ev, self, markers);
          });
        });

        infowindow.open(neatMap, self);
      });
    }

    /////////////////////////////////
    // GET
    // /////////////////////////////
    function getTypes() {
      return MapData.getTypes()
      .then(function(data) {
        vm.types = data.reduce(typeArrayToMap, {});
        vm.filterTypes = data.map(typeArrayToFilterModel);
        return vm.types;
      });

      function typeArrayToMap(prev, curr) {
        prev[curr.id] = curr.name;
        return prev;
      }

      function typeArrayToFilterModel(type) {
        type.checked = false;
        return type;
      }
    }

    function getRecords() {
      return MapData.getRecords()
        .then(function(data) {
          return data;
        });
    }

    /////////////////////////////////
    // Dialog setup
    // /////////////////////////////
    function setupControls() {
      vm.showDialog = MapDialog.initMarkerDialog(
        vm.types,
        Gmap,
        neatMap,
        magicMarker
      );

      $scope.$watch('mp.filterSeverity', function(now) {
        if (now && !clearing) {
          vm.applySeverity = true;
        }
        clearing = false;
      });
    }

    /////////////////////////////////
    // Filter Menu
    // /////////////////////////////
    function toggleSideMenu() {
      return $mdSidenav('left').toggle();
    }

    function filterUpdate() {
      var chosenTypes = vm.filterTypes.reduce(toTypeIdArray, []);
      // reset markers before update
      clearMarkers();
      // if nothing is chosen, do nothing
      if (chosenTypes.length === 0 && !vm.applySeverity) {
        return getRecords()
          .then(assignRecordsToMarkers);
      }
      // selecting all types is the same as selecting none: return all
      if (chosenTypes.length === vm.filterTypes.length) {
        chosenTypes = [];
      }
      // severity 0 to prevent applying severity filter for MapData service
      var fSeverity = vm.applySeverity ? vm.filterSeverity : 0;

      return MapData.getFilteredRecords(chosenTypes, fSeverity)
        .then(assignRecordsToMarkers);

      function toTypeIdArray(types, curr) {
        if (curr.checked) {
          types.push(curr.id);
        }
        return types;
      }
    }

    function filterClearAll() {
      clearing = true;
      vm.filterTypes.forEach(clearAllTypes);
      vm.filterSeverity = 1;
      vm.applySeverity = false;

      function clearAllTypes(type) {
        type.checked = false;
      }
      return;
    }

  }
})();
