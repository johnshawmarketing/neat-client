(function() {
  'use strict';

  angular
    .module('neatClient')
    .config(config);

  /** @ngInject */
  function config(
    $logProvider,
    $mdThemingProvider,
    $mdIconProvider
  ) {
    // Enable log
    $logProvider.debugEnabled(true);
    // Custom themes
    var neatGrey = $mdThemingProvider.extendPalette('blue-grey', {
      '900': '#1f2532'
    });
    var neatRed = $mdThemingProvider.extendPalette('red', {
      '400': '#ff5252'
    });
    $mdThemingProvider
      .definePalette('neatGrey', neatGrey)
      .definePalette('neatRed', neatRed)
      .theme('default')
      .primaryPalette('neatRed', {
        'default': '400'
      })
      .accentPalette('neatGrey', {
        'default': '900',
        'hue-2': '500'
      })
      .warnPalette('orange');
    // Register icons
    $mdIconProvider
      .icon('logo-header', '/assets/images/logo-header.svg')
      .icon('logo-login', '/assets/images/logo-login.svg');
  }

})();
