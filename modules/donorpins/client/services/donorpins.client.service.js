// Donorpins service used to communicate Donorpins REST endpoints
(function () {
  'use strict';

  angular
    .module('donorpins')
    .factory('DonorpinsService', DonorpinsService);

  DonorpinsService.$inject = ['$resource'];

  function DonorpinsService($resource) {
    return $resource('api/donorpins/:donorpinId', {
      donorpinId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
