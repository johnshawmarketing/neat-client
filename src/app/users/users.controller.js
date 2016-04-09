(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(
    UserData,
    $log,
    $document,
    AuthService,
    UserDialog
  ) {
    var vm = this;
    var users;
    var disabledUsers;
    var searchField;
    var showAdd = UserDialog.showAdd;

    vm.isAdmin = AuthService.isAdmin;
    vm.isSelf = AuthService.isSelf;
    vm.switchUsers = switchUsers;
    vm.showConfirm = UserDialog.showConfirm;
    vm.addOrDeleteAll = addOrDeleteAll;
    vm.changeRole = changeRole;
    vm.focusSearch = focusSearch;
    vm.roleClass = roleClass;
    vm.resetText = resetText;

    activate();

    function activate() {
      angular.element(document).ready(getSearchField);
      vm.showEnabled = true;
      return getUsers().then(successUsers);
      function getSearchField() {
        searchField = document.getElementById('user-search');
      }
    }

    /////////////////////////////////
    // GET users
    // /////////////////////////////
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

    function successUsers() {
      var type = vm.showEnabled ? ' ' : ' disabled ';
      $log.info('Loaded' + type + 'users');
    }

    function getDisabledUsers() {
      return UserData.getDisabledUsers()
        .then(assignUsers(disabledUsers));
    }

    /////////////////////////////////
    // ngClick functions
    // /////////////////////////////
    function switchUsers() {
      vm.showEnabled = !vm.showEnabled;
      return vm.showEnabled
        ? getUsers().then(successUsers)
        : getDisabledUsers().then(successUsers);
    }

    function addOrDeleteAll(ev) {
      if (vm.showEnabled) {
        showAdd(ev, vm.users);
      } else {
        vm.showConfirm(ev, 0, 'delAll', { name: '' }, vm.users);
      }
    }

    function changeRole(user) {
      var privilege = user.privilege == 'A' ? 'M' : 'A';
      UserData.updateRole(user.id, privilege)
        .then(function() {
          user.privilege = privilege;
        });
    }

    /////////////////////////////////
    // DOM manipulation
    // /////////////////////////////
    function focusSearch() {
      searchField.focus();
    }

    /////////////////////////////////
    // Classes and Texts
    // /////////////////////////////
    function roleClass(privilege) {
      return privilege == 'A'
        ? 'md-warn'
        : 'md-accent md-hue-3';
    }

    function resetText(user) {
      if (user.disabled) return 'enable';
      if (user.active) return 'reset';
      return 'inactive';
    }

  }
})();
