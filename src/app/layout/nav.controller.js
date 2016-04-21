(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('NavController', NavController);

  /** @ngInject */
  function NavController(
    AuthService,
    $state
  ) {
    var vm = this;

    vm.logout = logout;

    function logout() {
      AuthService.logout();
      $state.go('login');
    }

  }
})();
