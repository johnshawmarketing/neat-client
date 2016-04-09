(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserDialog', UserDialog);

  /** @ngInject */
  function UserDialog(
    $mdDialog,
    UserActions,
    UserData,
    $mdToast
  ) {
    var service = {
      showConfirm: showConfirm,
      showAdd: showAdd
    };

    return service;

    function showConfirm(ev, idx, type, user, users) {
      var dialog = {
        del: {
          text: ' delete ',
          content: 'If the user has associated records, user will be disabled instead. Switch to disabled users view to perform hard delete.',
          ariaLabel: 'Confirm delete',
          ok: 'Delete',
          confirmAction: function confirmDelete() {
            UserData.deleteUser(user.id).then(function(data) {
              users.splice(idx, 1);
              confirmToast(data.message + ': ' + user.name);
            });
          }
        },
        delAll: {
          text: ' DELETE ALL ',
          content: 'Delete all disabled users. Are you sure?',
          ariaLabel: 'Confirm delete all',
          ok: 'Delete All',
          confirmAction: function confirmDelAll() {
            UserData.deleteAllDisabled().then(function(data) {
              users.length = 0;
              confirmToast(data.message + ': ' + data.affected);
            });
          }
        },
        reset: {
          text: ' reset ',
          content: 'Deactivate user and reset password. Once reset, user need to go through sign up process same as new user',
          ariaLabel: 'Confirm reset',
          ok: 'Reset',
          confirmAction: function confirmReset() {
            UserData.resetUser(user.id).then(function() {
              user.active = false;
              confirmToast('Reset ' + user.name);
            });
          }
        },
        enable: {
          text: ' enable ',
          content: 'Will restore user to original state (active or inactive)',
          ariaLabel: 'Confirm enable',
          ok: 'Enable',
          confirmAction: function confirmEnable() {
            UserData.enableUser(user.id).then(function() {
              users.splice(idx, 1);
              confirmToast('Enabled ' + user.name);
            });
          }
        }
      };

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
    } // showConfirm

    function confirmToast(message) {
      return $mdToast.show(
        $mdToast.simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(2000)
      );
    }

    function showAdd(ev, users) {
      $mdDialog.show({
        controller: AddDialogController,
        templateUrl: 'app/users/add.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });

      function AddDialogController($scope, $mdDialog) {
        $scope.privilege = 'M';

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.add = function() {
          UserData.createUser({
            email: $scope.email,
            name: $scope.name,
            privilege: $scope.privilege
          }).then(function(data) {
            var user = data.user;
            users.push(user);
            confirmToast('Added user: ' + user.name);
            $mdDialog.hide();
          });
        };
      }
    } // showAdd

  } // UserDialog Service
})();
