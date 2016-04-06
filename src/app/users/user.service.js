(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserService', UserService);

  /** @ngInject */
  function UserService() {
    var enabledUsers = [
      {
        name: 'David Parsons',
        email: 'David.Parsons@GeorgianCollege.ca',
        privilege: 'A',
        active: true
      },
      {
        name: 'Martin Pennock',
        email: 'martin@gmail.com',
        privilege: 'A',
        active: true
      },
      {
        name: 'Slevin',
        email: 'slevin@gmail.com',
        privilege: 'M',
        active: false
      },
      {
        name: 'Random Name',
        email: 'random@random.org',
        privilege: 'M',
        active: true
      },
      {
        name: 'John Shaw',
        email: 'john@gmail.com',
        privilege: 'A',
        active: false
      },
      {
        name: 'Rich Freeman',
        email: 'rich@gmail.com',
        privilege: 'M',
        active: true
      },
      {
        name: 'Scott McDonald',
        email: 'scott@McDonald.com',
        privilege: 'M',
        active: true
      }
    ];
    var disabledUsers = [
      {
        name: 'Bill Gates',
        email: 'bill@outlook.com',
        privilege: 'A',
        active: null
      },
      {
        name: 'Steve Jobs',
        email: 'stevejobs@apple.heaven',
        privilege: 'M',
        active: null
      }
    ];

    var service = {
      getAll: getAll
    };

    return service;

    function getAll(options) {
      if (options) {
        if (options.disabled) {
          return disabledUsers;
        }
        if (options.enabled === false || options.disabled === false) {
          return [];
        }
      }
      return enabledUsers;
    }
  }
})();
