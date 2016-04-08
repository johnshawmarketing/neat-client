(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(
    UserData,
    $log,
    UserDialog
  ) {
    var vm = this;
    var users = [];
    var disabledUsers = [];
    var searchField;
    var showAdd;
    var successUsers = successInfo('Loaded Users');

    vm.switchUsers = switchUsers;
    vm.addOrDeleteAll = addOrDeleteAll;
    vm.roleClass = roleClass;
    vm.resetText = resetText;
    vm.focusSearch = focusSearch;

    activate();

    function activate() {
      angular.element(document).ready(getSearchField);
      vm.showEnabled = true;
      vm.showConfirm = UserDialog.initShowConfirm(vm.users);
      showAdd = UserDialog.initAddDialog(vm.users);
      return getUsers().then(successUsers);
      function getSearchField() {
        searchField = document.getElementById('user-search');
      }
    }

    function successInfo(message) {
      return function() {
        $log.info(message);
      };
    }

    function getUsers() {
      return UserData.getUsers()
        .then(assignUsers(users));
    }

    function assignUsers(users) {
      return function(data) {
        users = data;
        vm.users = users;
        return vm.users;
      };
    }

    function getDisabledUsers() {
      return UserData.getDisabledUsers()
        .then(assignUsers(disabledUsers));
    }

    function switchUsers() {
      vm.showEnabled = !vm.showEnabled;
      return vm.showEnabled
        ? getUsers().then(successUsers)
        : getDisabledUsers().then(successInfo('Loaded Disabled Users'));
    }

    function addOrDeleteAll(ev) {
      if (vm.showEnabled) {
        showAdd(ev);
      } else {
        $log.log('delete all');
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

  }
})();
