// Donorpins service used to communicate Donorpins REST endpoints
(function () {
  'use strict';

  angular
    .module('donorpins')
    .factory('MapPopupsService', MapPopupsService);

  MapPopupsService.$inject = [
    '$templateRequest', '$sce', '$compile', 'DonorpinsService', '$window'];

  function MapPopupsService($templateRequest, $sce, $compile, DonorpinsService, $window) {
    var mapService = {};

    mapService.showDonorPinPopupInformation = function showDonorPinPopupInformation(graphicContainer) {
      graphicContainer.graphic.layer.popup.open({
        location: graphicContainer.mapPoint
      });
    };

    mapService.showCreateNewDonorPinPopup = function showCreateNewDonorPinPopup(
      evt, addDonorPinCallBack, $scope) {
      var x = evt.mapPoint.x;
      var y = evt.mapPoint.y;
      var latitude = Math.round(evt.mapPoint.latitude * 1000) / 1000;
      var longitude = Math.round(evt.mapPoint.longitude * 1000) / 1000;

      var donorPinReference = new DonorpinsService();

      var donorpinCreateScope = {};
      donorpinCreateScope.donorpinFormService = donorPinReference;
      donorpinCreateScope.newDonorPinLongitude = longitude;
      donorpinCreateScope.newDonorPinLatitude = latitude;
      donorpinCreateScope.newDonorPinX = x;
      donorpinCreateScope.newDonorPinY = y;
      donorpinCreateScope.callbackFunction = addDonorPinCallBack;
      $scope.$ctrl = donorpinCreateScope;

      var templateUrl = $sce.getTrustedResourceUrl(
        'modules/donorpins/client/views/donorpin-create-popup.client.view.html'
      );
      $templateRequest(templateUrl).then(function (html) {
        var template = angular.element(html);
        $compile(template)($scope);
        $('#donorpin-create-popup-placeholder').html(template);
        $('#donorPinCreateModal').modal();
      }, function () {
        $window.alert('For some unexpected reason we couldn\'t load create donor pin template.');
      });
    };

    return mapService;
  }
}());
