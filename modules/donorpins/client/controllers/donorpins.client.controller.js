(function () {
  'use strict';

  // Donorpins controller
  angular
    .module('donorpins')
    .controller('DonorpinsController', DonorpinsController);

  DonorpinsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'donorpinResolve'];

  function DonorpinsController ($scope, $state, $window, Authentication, donorpin) {
    var vm = this;

    vm.authentication = Authentication;
    vm.donorpin = donorpin;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Donorpin
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.donorpin.$remove($state.go('donorpins.list'));
      }
    }

    // Save Donorpin
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.donorpinForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.donorpin._id) {
        vm.donorpin.$update(successCallback, errorCallback);
      } else {
        vm.donorpin.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('donorpins.view', {
          donorpinId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
