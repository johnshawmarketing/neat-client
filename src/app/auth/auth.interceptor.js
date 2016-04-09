(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('AuthInterceptor', AuthInterceptor);

  /** @ngInject */
  function AuthInterceptor(
    $q,
    AuthToken
  ) {

    var service = {
      request: request,
      responseError: responseError
    };

    return service;

    function request(config) {
      var token = AuthToken.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    function responseError(res) {
      if (res.status == 403) {
        AuthToken.setToken();
      }
      return $q.reject(res);
    }

  } // AuthInterceptor
})();
