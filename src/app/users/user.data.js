(function() {
  'use strict';

  angular
    .module('neatClient')
    .factory('UserData', UserData);

  /** @ngInject */
  function UserData() {
    var users = [
      {
        id: 1,
        name: 'David Parsons',
        email: 'David.Parsons@GeorgianCollege.ca',
        privilege: 'A',
        password: true,
        active: true,
        hasRecord: true
      },
      {
        id: 2,
        name: 'Martin Pennock',
        email: 'martin@gmail.com',
        privilege: 'A',
        password: true,
        active: true,
        hasRecord: true
      },
      {
        id: 3,
        name: 'Slevin Zhang',
        email: 'slevin@gmail.com',
        privilege: 'M',
        password: null,
        active: false,
        hasRecord: false
      },
      {
        id: 4,
        name: 'Random Name',
        email: 'random@random.org',
        privilege: 'M',
        password: true,
        active: true,
        hasRecord: false
      },
      {
        id: 5,
        name: 'John Shaw',
        email: 'john@gmail.com',
        privilege: 'A',
        password: null,
        active: false,
        hasRecord: true
      },
      {
        id: 6,
        name: 'Rich Freeman',
        email: 'rich@gmail.com',
        privilege: 'M',
        password: true,
        active: true,
        hasRecord: false
      },
      {
        id: 7,
        name: 'Bill Gates',
        email: 'bill@outlook.com',
        privilege: 'A',
        password: true,
        active: null,
        hasRecord: true
      },
      {
        id: 8,
        name: 'Steve Jobs',
        email: 'stevejobs@apple.heaven',
        privilege: 'M',
        password: null,
        active: null,
        hasRecord: false
      },
      {
        id: 9,
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
