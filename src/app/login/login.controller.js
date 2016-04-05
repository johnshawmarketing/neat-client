(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state) {
    var vm = this;

    vm.login = login;

    // activate();

    function activate() {
    }

    function login() {
      $state.go('map');
    }

  }
})();
