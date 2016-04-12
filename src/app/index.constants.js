(function() {
  'use strict';

  angular
    .module('neatClient')
    .constant('ApiKey', 'AIzaSyC_I1rGTiTnBiYQmCFou6xYWzC1rR3QetM')
    .constant('mapIcons', mapIcons)
    .constant('byId', byId)
    .constant('url', url);

  function mapIcons(type, level, Gmap) {
    type = type.toLowerCase();
    var levels = {
      1: '-green',
      2: '-yellow',
      3: '-yellow',
      4: '-red',
      5: '-red'
    };
    var url = '../assets/images/' + type + levels[level] + '.svg';
    return {
      url: url,
      anchor: new Gmap.Point(28, 28)
    };
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function url(path, id) {
    var baseUrl = 'http://localhost:4000/api';
    path = baseUrl + path;
    if (id) path += '/' + id;
    return path;
  }

})();
