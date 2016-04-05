(function() {
  'use strict';

  angular
    .module('neatClient')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig(
    $stateProvider,
    $locationProvider,
    $urlRouterProvider
  ) {
    $stateProvider
      .state('map', {
        url: '/',
        views: {
          nav: {
            templateUrl: 'app/layout/nav.html',
            controller: 'NavController',
            controllerAs: 'nv'
          },
          content: {
            templateUrl: 'app/map/map.html',
            controller: 'MapController',
            controllerAs: 'mp'
          }
        }
      })
      .state('login', {
        url: '/login',
        views: {
          content: {
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'lg'
          }
        }
      });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }

})();
