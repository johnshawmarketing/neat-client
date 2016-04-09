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
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      isAdmin: isAdmin,
      isSelf: isSelf,
      getMe: getMe
    };

    return service;

    function login(email, password) {
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
        return $q.reject(e);
      }
    }

    function logout() {
      AuthToken.setToken();
      $rootScope.user = {};
    }

    function isLoggedIn() {
      return AuthToken.getToken() ? true : false;
    }

    function isAdmin() {
      return Boolean($rootScope.user) && $rootScope.user.privilege == 'A';
    }

    function isSelf(id) {
      return $rootScope.user && $rootScope.user.id == id;
    }

    function getMe() {
      return $http.get(url('/me'))
        .then(getMeComplete)
        .catch(getMeFailed);

      function getMeComplete(data) {
        var me = data.data.user;
        $rootScope.user = me;
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
