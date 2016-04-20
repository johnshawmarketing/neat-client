(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('MapDialog', MapDialog);

  /** @ngInject */
  function MapDialog(
    byId,
    MapData,
    mapIcons,
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
      initMarkerDialog: initMarkerDialog,
      confirmDelete: confirmDelete
    };

    return service;

    function createInfoContent(record) {
      var address = '<h4>' + record.Location.address + '</h4>';
      var severity = '<p>Severity: ' + record.severity + '</p>';
      var description = '<p>' + (record.description || 'n/a') + '</p>';
      var divider = '<md-divider></md-divider>';
      var editBtn = '<button class="md-primary md-button" type="button"' +
        ' aria-label="Edit" id="edit-record-btn">Edit</button>';
      var delBtn = '<button class="md-primary md-button" type="button"' +
        ' aria-label="Delete" id="del-record-btn">Delete</button>';
      var content = address + severity + description +
                    divider + editBtn + delBtn;
      return content;
    }

    function initMarkerDialog(
      types,
      Gmap,
      neatMap,
      magicMarker
    ) {

      return function showDialog(ev, marker, infowindow, markers) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/map/marker.dialog.html',
          parent: angular.element($document[0].body),
          targetEvent: ev,
          clickOutsideToClose: true
        });

        function DialogController($scope, $mdDialog) {
          var vm = $scope;
          var record;
          var isUpdate = marker ? true : false;
          var isMapAdd;
          $timeout(addPlaceSearch);

          vm.types = types;
          vm.severity = 3;
          vm.cancel = cancel;
          vm.confirm = confirm;
          vm.locateCurrent = locateCurrent;

          if (isUpdate) {
            record = marker.myRecord;
            vm.lat = record.Location.latitude;
            vm.long = record.Location.longitude;
            vm.address = record.Location.address;
            vm.description = record.description;
            vm.severity = record.severity;
            vm.typeId = record.TypeId;
            // for adding directly on the map without clicking add button
            isMapAdd = !record.TypeId;
          }

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

          function confirm() {
            var recordVals = {
              long: vm.long,
              lat: vm.lat,
              address: vm.address,
              description: vm.description,
              severity: vm.severity,
              user_id: $rootScope.user.id,
              type_id: vm.typeId
            };

            if (isUpdate && !isMapAdd) {
              update(recordVals);
            } else {
              add(recordVals);
            }
            $mdDialog.hide();
          }

          function add(recordVals) {
            MapData.createRecord(recordVals)
              .then(function(data) {
                if (isMapAdd) {
                  infowindow.close();
                  confirmDelete(ev, marker, markers);
                }
                var newRecord = data.record;
                newRecord.Location = {
                  address: vm.address,
                  latitude: vm.lat,
                  longitude: vm.long
                };
                magicMarker(vm.lat, vm.long, newRecord, true);
              });
          }

          function update(recordVals) {
            MapData.updateRecord(record.id, recordVals)
              .then(function(data) {
                // closes infowindow
                infowindow.close();
                var newRecord = data.affected[1][0];
                newRecord.Location = {
                  address: vm.address,
                  latitude: vm.lat,
                  longitude: vm.long
                };
                marker.myRecord = newRecord;
                marker.setIcon(mapIcons(
                  types[newRecord.TypeId],
                  newRecord.severity,
                  Gmap
                ));
                marker.setPosition({
                  lat: vm.lat,
                  lng: vm.long
                });
              });
          }

          function locateCurrent() {
            vm.address = 'Locating...';
            vm.locating = true;
            if (nav.geolocation) {
              nav.geolocation.getCurrentPosition(function(pos) {
                  $log.log(pos);
                vm.lat = pos.coords.latitude;
                vm.long = pos.coords.longitude;
                var geocoder = new Gmap.Geocoder;
                geocoder.geocode({
                  location: { lat: vm.lat, lng: vm.long }
                }, function(results, status) {
                  vm.locating = false;
                  if (status === Gmap.GeocoderStatus.OK) {
                    if (results[0]) {
                      vm.address = results[0].formatted_address;
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
      }; // showDialog

    } // initMarkerDialog

    function confirmDelete(ev, marker, markers) {
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

      if (!record.TypeId) {
        return deleteUIcleanUp();
      }

      $mdDialog
        .show(confirm)
        .then(performDelete);

      function performDelete() {
        MapData.deleteRecord(marker.myRecord.id)
          .then(deleteUIcleanUp);
      }

      function deleteUIcleanUp(data) {
        marker.setMap(null);
        var idx = markers.indexOf(marker);
        if (idx > -1) {
          markers.splice(idx, 1);
        }
        if (data) {
          $log.info(data);
        }
      }
    } // confirmDelete


  } // MapDialog Service
})();
