(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController(
    AuthService,
    $log,
    $mdDialog,
    $scope,
    $state
  ) {
    var vm = this;

    vm.login = login;
    vm.join = joinNeat;
    vm.enter = enter;

    // TODO: if form invalid, disable function
    function login(ev) {
      if ($scope.loginForm.$valid) {
        AuthService.login(vm.email, vm.password)
          .then(function() {
            AuthService.getMe().then(function() {
              $state.go('map');
            });
          }).catch(function(err) {
            showInvalidDialog(ev, err.message);
          });
      } else {
        showInvalidDialog(ev, 'One or more fields invalid');
      }
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
      return login(ev);
    }

    function showInvalidDialog(ev, message) {
      var dialog = $mdDialog.confirm()
        .clickOutsideToClose(true)
        .title('Login Failed')
        .textContent(message)
        .ariaLabel('Invalid login warning dialog')
        .targetEvent(ev)
        .ok('Try Again')
        .cancel('Ok');

      $mdDialog.show(dialog).then(function() {
        vm.password = '';
      });
    }

  }
})();
