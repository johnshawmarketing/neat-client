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
    vm.join = join;

    function logout() {
      AuthService.logout();
      $state.go('login');
    }

    function join(argument) {
      $state.go('join');
    }

  }
})();
