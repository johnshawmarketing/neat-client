(function() {
  'use strict';

  angular
    .module('neatClient')
    .run(runBlock);

  /** @ngInject */
  function runBlock(
    $log,
    $rootScope,
    $state,
    AuthService
  ) {

    $rootScope.$on('$stateChangeStart', watchAuth);

    function watchAuth(e, toState) {
      var isLoggedIn = AuthService.isLoggedIn();

      if (toState.name === 'join') {
        return;
      }

      if (toState.name === 'login') {
        if (isLoggedIn) {
          e.preventDefault();
          $state.go('map');
        }
        return;
      }

      if (isLoggedIn) {
        if (!$rootScope.user || !$rootScope.user.privilege) {
          AuthService.getMe().then(function() {
            $log.info('Readded me');
          });
        }
      } else {
        e.preventDefault();
        $state.go('login');
      }
    }

    $log.debug('runBlock end');
  }

})();
