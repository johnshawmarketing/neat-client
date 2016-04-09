(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('NavController', NavController);

  /** @ngInject */
  function NavController(
    $state,
    AuthService
  ) {
    var vm = this;

    vm.logout = logout;

    activate();

    function activate() {
    }

    function logout() {
      AuthService.logout();
      $state.go('login');
    }

  }
})();
