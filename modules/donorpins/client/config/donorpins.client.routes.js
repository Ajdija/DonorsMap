(function () {
  'use strict';

  angular
    .module('donorpins')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('donorpins', {
        abstract: true,
        url: '/donorpins',
        template: '<ui-view/>'
      })
      .state('donorpins.list', {
        url: '',
        templateUrl: 'modules/donorpins/client/views/list-donorpins.client.view.html',
        controller: 'DonorpinsListController',
        controllerAs: 'vm',
        resolve: {
          donorpinResolve: newDonorpin
        },
        data: {
          pageTitle: 'Donorpins List'
        }
      })
      .state('donorpins.create', {
        url: '/create',
        templateUrl: 'modules/donorpins/client/views/donorpin-create.client.view.html',
        controller: 'DonorpinsController',
        controllerAs: 'vm',
        resolve: {
          donorpinResolve: newDonorpin
        },
        data: {
          pageTitle: 'Donorpins Create'
        }
      })
      .state('donorpins.edit', {
        url: '/:discreteIdentifier',
        templateUrl: 'modules/donorpins/client/views/form-donorpin-edit.client.view.html',
        controller: 'EditDonorpinsController',
        controllerAs: 'vm',
        resolve: {
          donorpinResolve: getDonorpin
        },
        data: {
          pageTitle: 'Edit Donorpin at ({{ donorpinResolve.latitude }} | {{ donorpinResolve.longitude }})'
        }
      });
  }

  getDonorpin.$inject = ['$stateParams', 'DonorpinsDiscreteService'];

  function getDonorpin($stateParams, DonorpinsDiscreteService) {
    return DonorpinsDiscreteService.get({
      discreteIdentifier: $stateParams.discreteIdentifier
    }).$promise;
  }

  newDonorpin.$inject = ['DonorpinsService'];

  function newDonorpin(DonorpinsService) {
    return new DonorpinsService();
  }
}());
