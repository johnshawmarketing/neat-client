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
    $window
  ) {
    var vm = this;
    var markers = [];
    // var records = [];
    var Gmap;
    var neatMap;
    var mapEl;

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

    function magicMarker(lat, lng, record, animate) {
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
      // records.push(record);
      markers.push(marker);

      return marker;
    }

    function attachMarkerEvent(marker) {
      marker.addListener('click', function(e) {
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
            vm.showDialog(ev, self, infowindow);
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
          // records = data;
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
    }

  }
})();
