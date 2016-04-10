(function() {
  'use strict';

  angular
    .module('neatClient')
    .constant('ApiKey', 'AIzaSyC_I1rGTiTnBiYQmCFou6xYWzC1rR3QetM')
    .constant('url', url);

  function url(path, id) {
    var baseUrl = 'http://localhost:4000/api';
    path = baseUrl + path;
    if (id) path += '/' + id;
    return path;
  }

})();
