(function () {
  'use strict';

  // Donorpins controller
  angular
    .module('donorpins')
    .component('donorPinForm', {
      templateUrl: 'modules/donorpins/client/views/form-donorpin.client.view.html',
      bindings: {
        donorpin: '<'
      },
      controller: DonorpinFormComponentController
    })
    .component('donorPinFormPopup', {
      templateUrl: 'modules/donorpins/client/views/form-donorpin-popup.client.view.html',
      bindings: {
        donorpin: '<',
        longitude: '<',
        latitude: '<',
        x: '<',
        y: '<',
        callback: '<'
      },
      controller: DonorpinFormComponentController
    });

  DonorpinFormComponentController.$inject = [
    '$scope', '$state', '$window', 'Authentication', '$templateRequest', '$sce', '$compile', 'Socket'
  ];

  function DonorpinFormComponentController($scope, $state, $window, Authentication,
                                           $templateRequest, $sce, $compile, Socket) {
    this.error;
    this.authentication = Authentication;
    this.error = null;
    this.form = {};
    this.save = save;
    var socket = Socket;
    var callback = this.callback;

    if (this.longitude !== undefined) {
      this.donorpin.longitude = this.longitude;
    }
    if (this.latitude !== undefined) {
      this.donorpin.latitude = this.latitude;
    }
    if (this.x !== undefined) {
      this.donorpin.x = this.x;
    }
    if (this.y !== undefined) {
      this.donorpin.y = this.y;
    }

    // Save Donorpin
    function save(isValid, donorpinService) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$ctrl.form.donorpinForm');
        return false;
      }

      if (donorpinService._id) {
        donorpinService.$update(successCallback, errorCallback);
      } else {
        donorpinService.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var resToBroadcast = jQuery.extend(true, {}, res); // deep-copy
        resToBroadcast.discreteIdentifier = undefined;
        socket.emit('update donor pin', resToBroadcast);

        var templateUrl = $sce.getTrustedResourceUrl(
          'modules/donorpins/client/views/form-donorpin-popup-success.client.view.html'
        );

        res.editUrl = 'http://localhost:3000/donorpins/' + res.discreteIdentifier;

        $templateRequest(templateUrl).then(function (template) {
          // template is the HTML template as a string

          // Let's put it into an HTML element and parse any directives and expressions
          // in the code.
          $compile($('#donorpin-create-popup').html(template).contents())($scope);
        }, function () {
          $window.alert('We saved your location. ' +
            'For some unexpected reason though we couldn\'t load template. ' +
            'Here is your edit pin url: ' + res.editUrl);
        });

        if ((callback !== undefined) && (callback !== null) && (typeof callback === 'function')) {
          callback(res);
        }
      }

      function errorCallback(res) {
        $window.alert(res.data.message);
      }
    }
  }

}());
