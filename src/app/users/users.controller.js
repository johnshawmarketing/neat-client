(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(
    UserData,
    UserDialog
  ) {
    var vm = this;
    var searchField;

    vm.switchUsers = switchUsers;
    vm.roleClass = roleClass;
    vm.resetText = resetText;
    vm.focusSearch = focusSearch;

    activate();

    function activate() {
      vm.showEnabled = true;
      vm.statusFilter = enabledFilter;
      vm.users = getUsers();
      vm.showConfirm = UserDialog.initShowConfirm(vm.users);
      angular.element(document).ready(getSearchField);
      function getSearchField() {
        searchField = document.getElementById('user-search');
      }
    }

    function switchUsers() {
      vm.showEnabled = !vm.showEnabled;
      vm.statusFilter = vm.showEnabled
        ? enabledFilter
        : disabledFilter;
    }

    function enabledFilter(user) {
      return user.active || user.active === false;
    }

    function disabledFilter(user) {
      return user.active === null;
    }

    function roleClass(privilege) {
      return privilege == 'A'
        ? 'md-warn'
        : 'md-accent md-hue-3';
    }

    function resetText(user) {
      if (user.active === null) return 'enable';
      if (user.active) return 'reset';
      return 'inactive';
    }

    function focusSearch(ev) {
      ev.preventDefault();
      searchField.focus();
    }

    function getUsers(options) {
      return UserData.getAll(options);
    }

  }
})();
