(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('NavController', NavController);

  /** @ngInject */
  function NavController($state) {
    var vm = this;

    vm.logout = logout;

    // activate();

    function activate() {
    }

    function logout() {
      $state.go('login');
    }

  }
})();
