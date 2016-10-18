(function () {
  'use strict';

  angular
    .module('donorsmaps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/donorsmaps/client/views/home.client.view.html',
        controller: 'HomeController',
        resolve: {
          donorpinResolve: newDonorpin
        },
        controllerAs: 'vm'
      });
  }

  newDonorpin.$inject = ['DonorpinsService'];

  function newDonorpin(DonorpinsService) {
    return new DonorpinsService();
  }
}());
