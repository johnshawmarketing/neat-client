(function() {
  'use strict';

  angular
    .module('neatClient')
    .controller('TitleController', TitleController);

  /** @ngInject */
  function TitleController(
    $rootScope,
    $state
  ) {
    var vm = this;
    var titles = {
      map: 'Map',
      users: 'Users',
      join: 'Join Neat',
      login: 'Login'
    };

    $rootScope.$on('$stateChangeSuccess', watchTitle);

    function watchTitle(e, toState) {
      vm.title = 'Neat | ' + titles[toState.name];
    }

  }
})();
