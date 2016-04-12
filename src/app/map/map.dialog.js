(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('MapDialog', MapDialog);

  /** @ngInject */
  function MapDialog(
    byId,
    MapData,
    $document,
    $log,
    $mdDialog,
    $mdToast,
    $rootScope,
    $timeout,
    $window
  ) {
    var nav = $window.navigator;

    var service = {
      createInfoContent: createInfoContent,
      initShowAdd: initShowAdd,
      confirmDelete: confirmDelete
    };

    return service;

    function createInfoContent(record) {
      var address = '<h4>' + record.Location.address + '</h4>';
      var severity = '<p>Severity: ' + record.severity + '</p>';
      var description = '<p>' + record.description + '</p>';
      var divider = '<md-divider></md-divider>';
      var editBtn = '<button class="md-primary md-button" type="button"' +
        ' aria-label="Edit" id="edit-record-btn">Edit</button>';
      var delBtn = '<button class="md-primary md-button" type="button"' +
        ' aria-label="Delete" id="del-record-btn">Delete</button>';
      var content = address + severity + description +
                    divider + editBtn + delBtn;
      return content;
    }

    function initShowAdd(
      types,
      Gmap,
      neatMap,
      magicMarker
    ) {

      return function showAdd(ev) {
        $mdDialog.show({
          controller: AddDialogController,
          templateUrl: 'app/map/marker.dialog.html',
          parent: angular.element($document[0].body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
      }; // showAdd

      function AddDialogController($scope, $mdDialog) {
        var vm = $scope;
        $timeout(addPlaceSearch);

        vm.types = types;
        vm.severity = 3;
        vm.cancel = cancel;
        vm.add = add;
        vm.locateCurrent = locateCurrent;

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
            vm.address = place.name;
            vm.long = place.geometry.location.lng();
            vm.lat = place.geometry.location.lat();
          });
        }

        function cancel() {
          $mdDialog.cancel();
        }

        function add() {
          MapData.createRecord({
            long: vm.long,
            lat: vm.lat,
            address: vm.address,
            description: vm.description,
            severity: vm.severity,
            user_id: $rootScope.user.id,
            type_id: vm.typeId
          }).then(function(data) {
            var record = data.record;
            record.Location = { address: vm.address };
            magicMarker(vm.lat, vm.long, record, true);
          });
          $mdDialog.hide();
        }

        function locateCurrent() {
          vm.address = 'Locating...';
          vm.locating = true;
          if (nav.geolocation) {
            nav.geolocation.getCurrentPosition(function(pos) {
              vm.lat = pos.coords.latitude;
              vm.long = pos.coords.longitude;
              var geocoder = new Gmap.Geocoder;
              geocoder.geocode({
                location: { lat: vm.lat, lng: vm.long }
              }, function(results, status) {
                vm.locating = false;
                if (status === Gmap.GeocoderStatus.OK) {
                  if (results[1]) {
                    vm.address = results[1].formatted_address;
                    vm.$apply();
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
    } // initShowAdd

    function confirmDelete(ev, marker, markers, records) {
      var record = marker.myRecord;
      var address = record.Location.address;
      var text =
        'Inreversible. Are you sure you want to delete: ' + address + '?';
      var confirm = $mdDialog.confirm()
        .title('Confirm to delete')
        .textContent(text)
        .ariaLabel('Confirm delete')
        .targetEvent(ev)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog
      .show(confirm)
      .then(performDelete);

      function performDelete() {
        MapData.deleteRecord(marker.myRecord.id)
          .then(deleteUIcleanUp);
      }

      function deleteUIcleanUp(data) {
        records.splice(records.indexOf(record), 1);
        marker.setMap(null);
        markers.splice(markers.indexOf(marker), 1);
        $log.info(data);
      }
    } // confirmDelete


  } // MapDialog Service
})();
