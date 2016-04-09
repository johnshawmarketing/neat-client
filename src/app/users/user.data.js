(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserData', UserData);

  /** @ngInject */
  function UserData(
    baseUrl,
    $q,
    $log,
    $http
  ) {

    var service = {
      getUsers: getUsers,
      getDisabledUsers: getDisabledUsers,
      createUser: createUser,
      resetUser: resetUser,
      updateRole: updateRole,
      enableUser: enableUser,
      deleteUser: deleteUser,
      deleteAllDisabled: deleteAllDisabled
    };

    return service;

    /////////////////////////////////
    // GET
    // /////////////////////////////
    function getUsers() {
      return $http.get(url('/users'))
        .then(getUsersComplete)
        .catch(catchErrorFn('XHR getUsers failed'));
    }

    function getDisabledUsers() {
      return $http.get(url('/users?disabled=1'))
        .then(getUsersComplete)
        .catch(catchErrorFn('XHR getDisabledUsers failed'));
    }

    /////////////////////////////////
    // Promise Fulfilled / Rejected
    // /////////////////////////////
    function getUsersComplete(data) {
      var users = data.data.users;
      return users;
    }

    function actionComplete(data) {
      return data.data;
    }

    function catchErrorFn(errMsg) {

      return function requestFailed(e) {
        var newMessage = errMsg;
        if (e.data && e.data.description) {
          newMessage += '\n' + e.data.description;
        }
        if (e.data) {
          e.data.description = newMessage;
        }
        $log.error(e.data);
        return $q.reject(e);
      };
    }

    /////////////////////////////////
    // POST
    // /////////////////////////////
    function createUser(user) {
      return $http.post(url('/users'), user)
        .then(actionComplete)
        .catch(catchErrorFn('XHR createUser failed'));
    }

    /////////////////////////////////
    // PUT
    // /////////////////////////////
    function resetUser(id) {
      return $http.put(url('/user', id), {
        password: 'null',
        active: 'No'
      }).then(actionComplete)
        .catch(catchErrorFn(actionErrMsg('resetUser', id)));
    }

    function updateRole(id, privilege) {
      return $http.put(url('/user', id), {
        privilege: privilege
      }).then(actionComplete)
        .catch(catchErrorFn(actionErrMsg('updateRole', id)));
    }

    function enableUser(id) {
      return $http.put(url('/user', id), {
        disabled: 'false'
      }).then(actionComplete)
        .catch(catchErrorFn(actionErrMsg('enableUser', id)));
    }

    /////////////////////////////////
    // DELETE
    // /////////////////////////////
    function deleteUser(id) {
      return $http.delete(url('/user', id))
        .then(actionComplete)
        .catch(catchErrorFn(actionErrMsg('deleteUser', id)));
    }

    function deleteAllDisabled() {
      return $http.delete(url('/users'))
        .then(actionComplete)
        .catch(catchErrorFn('XHR deleteAllDisabled failed'));
    }

    /////////////////////////////////
    // Helpers
    // /////////////////////////////
    function actionErrMsg(name, id) {
      return 'XHR ' + name + ' by ' + id + ' failed';
    }

    function url(path, id) {
      path = baseUrl + path;
      if (id) path += '/' + id;
      return path;
    }
  }
})();
