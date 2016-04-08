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
      getDisabledUsers: getDisabledUsers
    };

    return service;

    function getUsers() {
      return $http.get(url('/users'))
        .then(getUsersComplete)
        .catch(catchErrorFn('XHR getUsers failed'));

    }

    function getUsersComplete(data) {
      var users = data.data.users;
      $log.log(users);
      return users;
    }

    function getDisabledUsers() {
      return $http.get(url('/users?disabled=1'))
        .then(getUsersComplete)
        .catch(catchErrorFn('XHR getDisabledUsers failed'));
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
        $log.error(newMessage);
        return $q.reject(e);
      };
    }

    function url(path) {
      return baseUrl + path;
    }
  }
})();
