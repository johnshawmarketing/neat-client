(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('AuthService', AuthService);

  /** @ngInject */
  function AuthService(
    AuthToken,
    $http,
    $q,
    $log,
    $rootScope,
    url
  ) {

    var service = {
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isSelf: isSelf,
      getMe: getMe
    };

    return service;

    function register(email, name, password, confirm) {
      return $http.put(url('/register'), {
        email: email,
        name: name,
        password: password,
        confirm: confirm
      }).then(registrationComplete)
        .catch(registrationFailed);

      function registrationComplete(data) {
        return data.data;
      }

      function registrationFailed(e) {
        $log.error(e.data);
        return $q.reject(e);
      }
    }

    function login(email, password) {
      // make sure to clear user, useful for register
      logout();

      return $http.post(url('/authenticate'), {
        email: email,
        password: password
      }).then(authSuccess)
        .catch(authFailed);

      function authSuccess(data) {
        AuthToken.setToken(data.data.token);
        return data.data;
      }

      function authFailed(e) {
        AuthToken.setToken();
        $log.error(e.data);
        return $q.reject(e.data);
      }
    }

    function logout() {
      AuthToken.setToken();
      $rootScope.me = {};
    }

    function isLoggedIn() {
      return AuthToken.getToken() ? true : false;
    }

    function isAdmin() {
      return Boolean($rootScope.me) && $rootScope.me.privilege == 'A';
    }

    function isSelf(id) {
      return $rootScope.me && $rootScope.me.id == id;
    }

    function getMe() {
      return $http.get(url('/me'))
        .then(getMeComplete)
        .catch(getMeFailed);

      function getMeComplete(data) {
        var me = data.data.user;
        $rootScope.me = me;
        $log.info('Added me');
        return me;
      }

      function getMeFailed(e) {
        $log.error(e.data);
        return $q.reject(e);
      }
    }

  } // AuthService
})();
