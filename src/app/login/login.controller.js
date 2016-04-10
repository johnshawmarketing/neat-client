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
    vm.enter = enter;

    // TODO: if form invalid, disable function
    function login() {
      AuthService.login(vm.email, vm.password)
        .then(function() {
          AuthService.getMe().then(function() {
            $state.go('map');
          });
        });
    }

    function enter(ev) {
      if (ev.charCode !== 13) return;
      return login();
    }

  }
})();
