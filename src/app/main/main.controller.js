(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log) {
    var vm = this;

    vm.random = Math.random();

    activate();

    function activate() {
      $log.log('Main Controller loaded', vm.random);
    }

  }
})();
