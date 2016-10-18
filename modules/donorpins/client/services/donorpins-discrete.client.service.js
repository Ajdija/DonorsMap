// Donorpins service used to communicate Donorpins REST endpoints
(function () {
  'use strict';

  angular
    .module('donorpins')
    .factory('DonorpinsDiscreteService', DonorpinsDiscreteService);

  DonorpinsDiscreteService.$inject = ['$resource'];

  function DonorpinsDiscreteService($resource) {
    return $resource('api/donorpins/:discreteIdentifier', {
      discreteIdentifier: '@discreteIdentifier'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
