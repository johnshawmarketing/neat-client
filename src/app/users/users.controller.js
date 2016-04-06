(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController($log) {
    var vm = this;

    vm.privileges = ['Admin', 'Member'];
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

    function getUsers() {
      return [
        {
          name: 'David Parsons',
          email: 'David.Parsons@GeorgianCollege.ca',
          privilege: 'A',
          active: true
        },
        {
          name: 'Martin Pennock',
          email: 'martin@gmail.com',
          privilege: 'A',
          active: true
        },
        {
          name: 'Slevin',
          email: 'slevin@gmail.com',
          privilege: 'M',
          active: false
        },
        {
          name: 'John Shaw',
          email: 'john@gmail.com',
          privilege: 'A',
          active: false
        },
        {
          name: 'Rich Freeman',
          email: 'rich@gmail.com',
          privilege: 'M',
          active: true
        }
      ];
    }

  }
})();
