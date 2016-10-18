(function () {
  'use strict';

  // Donorpins controller
  angular
    .module('donorpins')
    .controller('EditDonorpinsController', EditDonorpinsController);

  EditDonorpinsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'donorpinResolve', 'Socket'];

  function EditDonorpinsController ($scope, $state, $window, Authentication, donorpin, Socket) {
    var vm = this;
    vm.donorpin = donorpin;
    vm.error = null;
    vm.form = {};
    vm.socket = Socket;
    vm.remove = remove;

    // Remove existing Donorpin
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        var resToBroadcast = jQuery.extend(true, {}, vm.donorpin); // deep-copy
        resToBroadcast.discreteIdentifier = undefined;
        vm.socket.emit('remove donor pin', resToBroadcast);

        vm.donorpin.$remove($state.go('home'));
      }
    }
  }
}());
