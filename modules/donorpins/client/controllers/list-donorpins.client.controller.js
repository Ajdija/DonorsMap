(function () {
  'use strict';

  angular
    .module('donorpins')
    .controller('DonorpinsListController', DonorpinsListController);

  DonorpinsListController.$inject = ['DonorpinsService', 'donorpinResolve'];

  function DonorpinsListController(DonorpinsService, donorpinFormService) {
    var vm = this;

    vm.donorpinFormService = donorpinFormService;

    vm.donorpins = DonorpinsService.query();
  }
}());
