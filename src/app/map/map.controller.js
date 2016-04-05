(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('MapController', MapController);

  /** @ngInject */
  function MapController($log) {
    var vm = this;

    vm.random = Math.random();

    activate();

    function activate() {
      $log.log('Map Controller loaded', vm.random);
    }

  }
})();
