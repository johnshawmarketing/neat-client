(function() {
  'use strict';

  angular
    .module('neatClient')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        views: {
          tnav: {
            templateUrl: 'app/layout/nav.html',
            controller: 'NavController',
            controllerAs: 'nv'
          },
          content: {
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'mn'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
