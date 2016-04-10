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
    var navView = {
      templateUrl: 'app/layout/nav.html',
      controller: 'NavController',
      controllerAs: 'nv'
    };

    $stateProvider
      .state('map', {
        url: '/',
        views: {
          nav: navView,
          content: {
            templateUrl: 'app/map/main.html',
            controller: 'MainController',
            controllerAs: 'mn'
          }
        }
      })
      .state('users', {
        url: '/users',
        views: {
          nav: navView,
          content: {
            templateUrl: 'app/users/users.html',
            controller: 'UsersController',
            controllerAs: 'us'
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
