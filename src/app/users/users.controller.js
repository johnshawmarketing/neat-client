(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(UserService) {
    var vm = this;

    vm.roleClass = roleClass;

    activate();

    function activate() {
      vm.users = getUsers();
    }

    function roleClass(privilege) {
      return privilege === 'A'
        ? 'md-warn'
        : 'md-accent md-hue-3';
    }

    function getUsers(options) {
      return UserService.getAll(options);
    }

  }
})();
