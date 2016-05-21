(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('AuthController', AuthController);

  /** @ngInject */
  function AuthController(
    AuthService,
    $mdDialog,
    $scope,
    $state
  ) {
    var vm = this;

    vm.login = login;
    vm.join = joinNeat;
    vm.enter = enter;

    function login(ev) {
      var isValid = $scope.loginForm
        ? $scope.loginForm.$valid
        : $scope.joinForm.$valid;

      if (isValid) {
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

    function joinNeat(ev) {
      AuthService.register(
        vm.email,
        vm.name,
        vm.password,
        vm.confirm
      ).then(function(res) {
        if (res.user.active) {
          login(ev);
        }
      }).catch(function(err) {
        showInvalidDialog(ev, err.data.message);
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
