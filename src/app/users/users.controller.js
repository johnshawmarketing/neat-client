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
    var showAdd;

    vm.switchUsers = switchUsers;
    vm.addOrDeleteAll = addOrDeleteAll;
    vm.roleClass = roleClass;
    vm.resetText = resetText;
    vm.focusSearch = focusSearch;

    activate();

    function activate() {
      angular.element(document).ready(getSearchField);
      vm.showEnabled = true;
      vm.statusFilter = enabledFilter;
      vm.users = getUsers();
      vm.showConfirm = UserDialog.initShowConfirm(vm.users);
      showAdd = UserDialog.initAddDialog(vm.users);
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

    function addOrDeleteAll(ev) {
      if (vm.showEnabled) {
        showAdd(ev);
      } else {
        console.log('delete all');
      }
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

    function focusSearch() {
      searchField.focus();
    }

    function getUsers(options) {
      return UserData.getAll(options);
    }

  }
})();
