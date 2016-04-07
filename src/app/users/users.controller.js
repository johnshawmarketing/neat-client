(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(
    UserService,
    $mdDialog,
    $mdToast,
    filterFilter
  ) {
    var vm = this;

    vm.switchUsers = switchUsers;
    vm.roleClass = roleClass;
    vm.resetText = resetText;
    vm.showConfirm = showConfirm;

    activate();

    function activate() {
      vm.showEnabled = true;
      vm.userFilter = enabledFilter;
      vm.users = getUsers();
    }

    function enabledFilter(user) {
      return user.active || user.active === false;
    }

    function disabledFilter(user) {
      return user.active === null;
    }

    function switchUsers() {
      vm.showEnabled = !vm.showEnabled;
      vm.userFilter = vm.showEnabled
        ? enabledFilter
        : disabledFilter;
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

    function showConfirm(ev, idx, type, user) {
      var dialog = {
        del: {
          text: ' delete ',
          content: 'If the user has associated records, user will be disabled instead. Switch to disabled users view to perform hard delete.',
          ariaLabel: 'Confirm delete',
          ok: 'Delete',
          confirmAction: function confirmDelete() {
            user.active = null;
            showConfirmToast();
          },
          done: 'Trashed '
        },
        reset: {
          text: ' reset ',
          content: 'Deactivate user and reset password. Once reset, user need to go through sign up process same as new user',
          ariaLabel: 'Confirm reset',
          ok: 'Reset',
          confirmAction: function confirmReset() {
            user.active = false;
            showConfirmToast();
          },
          done: 'Reset '
        },
        enable: {
          text: ' enable ',
          content: 'Will restore user to original state (active or inactive)',
          ariaLabel: 'Confirm enable',
          ok: 'Enable',
          confirmAction: function confirmEnable() {
            user.active = user.password ? true : false;
            showConfirmToast();
          },
          done: 'Enabled '
        }
      };

      function showConfirmToast() {
        return $mdToast.show(
          $mdToast.simple()
            .textContent(dialog[type].done + user.name + '!')
            .position('bottom right')
            .hideDelay(2000)
        );
      }

      function showCancelToast() {
        return $mdToast.show(
          $mdToast.simple()
            .textContent('Cancelled!')
            .hideDelay(1000)
        );
      }

      function confirmTitle() {
        return 'Confirm to' + dialog[type].text + user.name;
      }

      var confirm = $mdDialog.confirm()
            .title(confirmTitle())
            .textContent(dialog[type].content)
            .ariaLabel(dialog[type].ariaLabel)
            .targetEvent(ev)
            .ok(dialog[type].ok)
            .cancel('Cancel');

      $mdDialog
        .show(confirm)
        .then(dialog[type].confirmAction);
    }

    function getUsers(options) {
      return UserService.getAll(options);
    }

  }
})();
