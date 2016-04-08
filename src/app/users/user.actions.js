(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserActions', UserActions);

  /** @ngInject */
  function UserActions(
  ) {
    var service = {
      addUser: addUser,
      resetUser: resetUser,
      enableUser: enableUser,
      deleteUser: deleteUser
    };

    return service;

    function addUser(email, name, privilege, users, toast) {
      var user = {
        id: users.length + 1,
        email: email,
        name: name,
        privilege: privilege,
        password: null,
        active: false,
        hasRecord: false
      };
      users.push(user);
      return toast && toast('Added ' + user.name + '. Email sent.');
    }

    function resetUser(user, toast) {
      user.active = false;
      return toast && toast('Reset ' + user.name + '. Email sent.');
    }

    function enableUser(user, toast) {
      user.active = user.password ? true : false;
      return toast && toast('Enabled ' + user.name + '!');
    }

    function deleteUser(user, users, toast) {
      if (user.hasRecord && user.active !== null) {
        user.active = null;
        return toast && toast('User has records. Disabled ' + user.name + '!');
      } else {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == user.id) {
            users.splice(i, 1);
            break;
          }
        }
        return toast && toast('Deleted ' + user.name + ' forever!');
      }
    }

  }
})();
