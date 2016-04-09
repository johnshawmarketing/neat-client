(function() {
  'use strict';

  angular
    .module('neatClient')
    .constant('url', url);

  function url(path, id) {
    var baseUrl = 'http://localhost:4000/api';
    path = baseUrl + path;
    if (id) path += '/' + id;
    return path;
  }

})();
