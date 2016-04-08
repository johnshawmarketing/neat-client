(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserActions', UserActions);

  /** @ngInject */
  function UserActions(
  ) {
    var service = {
      resetUser: resetUser,
      enableUser: enableUser,
      deleteUser: deleteUser
    };

    return service;

    function resetUser(user, toast) {
      user.active = false;
      toast('Reset ' + user.name + '. Email sent.');
    }

    function enableUser(user, toast) {
      user.active = user.password ? true : false;
      toast('Enabled ' + user.name + '!');
    }

    function deleteUser(user, users, toast) {
      if (user.hasRecord && user.active !== null) {
        user.active = null;
        toast('User has records. Disabled ' + user.name + '!');
      } else {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == user.id) {
            users.splice(i, 1);
            break;
          }
        }
        toast('Deleted ' + user.name + ' forever!');
      }
    }

  }
})();
