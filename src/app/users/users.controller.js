(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController($log) {
    var vm = this;

    vm.random = 'hello';

    activate();

    function activate() {
      $log.log('Users Controller loaded', vm.random);
    }

  }
})();
