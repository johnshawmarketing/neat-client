(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('MapData', MapData);

  /** @ngInject */
  function MapData(
    url,
    $q,
    $log,
    $http
  ) {

    var service = {
      getTypes: getTypes,
    };

    return service;

    /////////////////////////////////
    // GET
    // /////////////////////////////
    function getTypes() {
      return $http.get(url('/types'))
        .then(getDataComplete('types'))
        .catch(catchErrorFn('XHR getTypes failed'));
    }

    /////////////////////////////////
    // Promise Fulfilled / Rejected
    // /////////////////////////////
    function getDataComplete(type) {
      return function complete(data) {
        return data.data[type];
      };
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

    /////////////////////////////////
    // PUT
    // /////////////////////////////

    /////////////////////////////////
    // DELETE
    // /////////////////////////////

    /////////////////////////////////
    // Helpers
    // /////////////////////////////
    function actionErrMsg(name, id) {
      return 'XHR ' + name + ' by ' + id + ' failed';
    }

  }
})();
