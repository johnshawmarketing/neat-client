(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('MapDialog', MapDialog);

  /** @ngInject */
  function MapDialog(
    $mdDialog,
    $document,
    $mdToast
  ) {
    var doc = $document[0];

    var service = {
      showAdd: showAdd
    };

    return service;

    function showAdd(ev, markers) {
      $mdDialog.show({
        controller: AddDialogController,
        templateUrl: 'app/components/neatmap/marker_add.dialog.html',
        parent: angular.element(doc.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });

      function AddDialogController($scope, $mdDialog) {
        $scope.types = [
          'Lighting',
          'Road Hazard',
          'Garbage',
          'Housing',
          'Graffiti',
          'Driveway'
        ].map(function(type, i) { return { id: i, name: type }; });

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.add = function() {
          $mdDialog.hide();
        };
      }
    }


  } // MapDialog Service
})();
