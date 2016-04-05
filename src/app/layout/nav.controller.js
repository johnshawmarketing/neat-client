(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('NavController', NavController);

  /** @ngInject */
  function NavController($log) {
    var vm = this;

    vm.random = 'hello';

    activate();

    function activate() {
      $log.log('Nav Controller loaded', vm.random);
    }

  }
})();
