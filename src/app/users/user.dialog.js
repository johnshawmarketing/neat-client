(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserDialog', UserDialog);

  /** @ngInject */
  function UserDialog(
    $mdDialog,
    UserActions,
    $mdToast
  ) {
    var service = {
      initShowConfirm: initShowConfirm,
      initAddDialog: initAddDialog
    };

    return service;

    function initShowConfirm(users) {

      return function showConfirm(ev, idx, type, user) {
        var dialog = {
          del: {
            text: ' delete ',
            content: 'If the user has associated records, user will be disabled instead. Switch to disabled users view to perform hard delete.',
            ariaLabel: 'Confirm delete',
            ok: 'Delete',
            confirmAction: function confirmDelete() {
              UserActions.deleteUser(user, users, confirmToast);
            }
          },
          reset: {
            text: ' reset ',
            content: 'Deactivate user and reset password. Once reset, user need to go through sign up process same as new user',
            ariaLabel: 'Confirm reset',
            ok: 'Reset',
            confirmAction: function confirmReset() {
              UserActions.resetUser(user);
            }
          },
          enable: {
            text: ' enable ',
            content: 'Will restore user to original state (active or inactive)',
            ariaLabel: 'Confirm enable',
            ok: 'Enable',
            confirmAction: function confirmEnable() {
              UserActions.enableUser(user, confirmToast);
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
      };
    } // init showConfirm

    function confirmToast(message) {
      return $mdToast.show(
        $mdToast.simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(2000)
      );
    }

    function cancelToast() {
      return $mdToast.show(
        $mdToast.simple()
        .textContent('Cancelled!')
        .hideDelay(1000)
      );
    }

    function initAddDialog(users) {

      return function showAdd(ev) {
        $mdDialog.show({
          controller: AddDialogController,
          templateUrl: 'app/users/add.dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
      };

      function AddDialogController($scope, $mdDialog) {
        $scope.privilege = 'M';

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.add = function() {
          UserActions.addUser(
            $scope.email,
            $scope.name,
            $scope.privilege,
            users,
            confirmToast
          );
          $mdDialog.hide();
        };
      }
    } // init addDialog

  } // UserDialog Service
})();
