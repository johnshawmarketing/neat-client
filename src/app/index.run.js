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
      if (toState.name === 'login') {
        return;
      }
      if (AuthService.isLoggedIn()) {
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
