(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('AuthToken', AuthToken);

  /** @ngInject */
  function AuthToken(
    $window
  ) {

    var service = {
      getToken: getToken,
      setToken: setToken
    };

    return service;

    function getToken() {
      return $window.localStorage.getItem('token');
    }

    function setToken(token) {
      if (token) {
        $window.localStorage.setItem('token', token);
      } else {
        $window.localStorage.removeItem('token');
      }
    }

  } // AuthToken
})();
