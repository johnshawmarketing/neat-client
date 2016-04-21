(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController(
    $state,
    $log,
    AuthService
  ) {
    var vm = this;

    vm.login = login;
    vm.join = joinNeat;
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

    function joinNeat() {
      AuthService.register(
        vm.email,
        vm.name,
        vm.password,
        vm.confirm
      ).then(function(res) {
        if (res.user.active) {
          login();
        }
      });
    }

    function enter(ev, join) {
      if (ev.charCode !== 13) return;
      if (join) {
        return joinNeat();
      }
      return login();
    }

  }
})();
