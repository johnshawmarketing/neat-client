(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(
    $state,
    $log,
    AuthService
  ) {
    var vm = this;

    vm.login = login;

    activate();

    function activate() {
    }

    // TODO: if form invalid, disable function
    function login() {
      AuthService.login(vm.email, vm.password)
        .then(function() {
          AuthService.getMe().then(function() {
            $state.go('map');
          });
        });
    }

  }
})();
