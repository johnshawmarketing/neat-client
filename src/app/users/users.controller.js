(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(UserService, $mdDialog, $mdToast) {
    var vm = this;
    var enabledUsers;
    var disabledUsers;

    vm.switchUsers = switchUsers;
    vm.roleClass = roleClass;
    vm.showConfirm = showConfirm;

    activate();

    function activate() {
      enabledUsers = getUsers();
      disabledUsers = getUsers({ disabled: true });
      vm.users = enabledUsers;
      vm.areEnabled = true;
    }

    function switchUsers() {
      vm.areEnabled = !vm.areEnabled;
      vm.users = vm.areEnabled
        ? enabledUsers
        : disabledUsers;
    }

    function roleClass(privilege) {
      return privilege == 'A'
        ? 'md-warn'
        : 'md-accent md-hue-3';
    }

    function showConfirm(ev, idx, type, user) {
      var dialog = {
        del: {
          text: ' delete ',
          content: 'If the user has associated records, user will be disabled instead. Switch to disabled users view to perform hard delete.',
          ariaLabel: 'Confirm delete',
          ok: 'Delete',
          confirmAction: function confirmDelete() {
            vm.users.splice(idx, 1);
            showConfirmToast();
          },
          done: 'Deleted '
        },
        reset: {
          text: ' reset ',
          content: 'Deactivate user and reset password. Once reset, user need to go through sign up process same as new user',
          ariaLabel: 'Confirm reset',
          ok: 'Reset',
          confirmAction: function confirmReset() {
            vm.users[idx].active = false;
            showConfirmToast();
          },
          done: 'Reset '
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
