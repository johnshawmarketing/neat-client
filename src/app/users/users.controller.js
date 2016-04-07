(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('UsersController', UsersController);

  /** @ngInject */
  function UsersController(UserService, $mdDialog, $mdToast, $element) {
    var vm = this;

    vm.roleClass = roleClass;
    vm.showConfirm = showConfirm;

    activate();

    function activate() {
      vm.users = getUsers();
      console.log($element);
    }

    function roleClass(privilege) {
      return privilege === 'A'
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
          }
        },
        reset: {
          text: ' reset ',
          content: 'Deactivate user and reset password. Once reset, user need to go through sign up process same as new user',
          ariaLabel: 'Confirm reset',
          ok: 'Reset',
          confirmAction: function confirmReset() {
            vm.users[idx].active = false;
            showConfirmToast();
          }
        }
      };

      function showConfirmToast() {
        return $mdToast.show(
          $mdToast.simple()
            .textContent(dialog[type].ok + ' ' + user.name + '!')
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
        .then(dialog[type].confirmAction, showCancelToast);
    }

    function getUsers(options) {
      return UserService.getAll(options);
    }

  }
})();
