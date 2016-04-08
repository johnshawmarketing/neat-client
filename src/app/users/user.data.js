(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserData', UserData);

  /** @ngInject */
  function UserData() {
    var users = [
      {
        name: 'David Parsons',
        email: 'David.Parsons@GeorgianCollege.ca',
        privilege: 'A',
        password: true,
        active: true,
        hasRecord: true
      },
      {
        name: 'Martin Pennock',
        email: 'martin@gmail.com',
        privilege: 'A',
        password: true,
        active: true,
        hasRecord: true
      },
      {
        name: 'Slevin Zhang',
        email: 'slevin@gmail.com',
        privilege: 'M',
        password: null,
        active: false,
        hasRecord: false
      },
      {
        name: 'Random Name',
        email: 'random@random.org',
        privilege: 'M',
        password: true,
        active: true,
        hasRecord: false
      },
      {
        name: 'John Shaw',
        email: 'john@gmail.com',
        privilege: 'A',
        password: null,
        active: false,
        hasRecord: true
      },
      {
        name: 'Rich Freeman',
        email: 'rich@gmail.com',
        privilege: 'M',
        password: true,
        active: true,
        hasRecord: false
      },
      {
        name: 'Bill Gates',
        email: 'bill@outlook.com',
        privilege: 'A',
        password: true,
        active: null,
        hasRecord: true
      },
      {
        name: 'Steve Jobs',
        email: 'stevejobs@apple.heaven',
        privilege: 'M',
        password: null,
        active: null,
        hasRecord: false
      },
      {
        name: 'Scott McDonald',
        email: 'scott@McDonald.com',
        privilege: 'M',
        password: true,
        active: true,
        hasRecord: true
      }
    ];
    var service = {
      getAll: getAll
    };

    return service;

    function getAll() {
      return users;
    }
  }
})();
