// Donorpins service used to communicate Donorpins REST endpoints
(function () {
  'use strict';

  angular
    .module('donorpins')
    .factory('DonorpinsMapService', DonorpinsService);

  DonorpinsService.$inject = ['$resource', 'esriLoader'];

  function DonorpinsService($resource, esriLoader) {
    var mapService = {};
    var markerImagePath = '/modules/donorpins/client/img/pin.png';

    esriLoader.require([
      'esri/geometry/Point',
      'esri/Graphic',
      'esri/layers/GraphicsLayer',
      'esri/Map',
      'esri/symbols/SimpleFillSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/PictureMarkerSymbol',
      'esri/widgets/Search',
      'esri/PopupTemplate'
    ], function (Point, Graphic, GraphicsLayer, Map,
                 SimpleFillSymbol, SimpleLineSymbol,
                 SimpleMarkerSymbol, PictureMarkerSymbol,
                 Search, PopupTemplate) {
      mapService.getDonorPinLayer = function getDonorPinLayer(donorPinModel) {
        var longitude = donorPinModel.longitude;
        var latitude = donorPinModel.latitude;
        var point = new Point(longitude, latitude);
        var symbol = new PictureMarkerSymbol(markerImagePath, 32, 32);
        var graphic = new Graphic({
          attributes: donorPinModel,
          geometry: point,
          symbol: symbol
        });
        var popupTemplate = {
          title: 'Donor information',
          content: '<table>' +
          '<tr><td>Name</td><td>{firstname} {lastname}</td></tr>' +
          '<tr><td>Blood Group</td><td>{bloodgroup}</td></tr>' +
          '<tr><td>Contact number</td><td>{contactnumber}</td></tr>' +
          '<tr><td>Email address</td><td>{emailaddress}</td></tr>' +
          '</table>'
        };

        var layer = new GraphicsLayer();
        layer.donorPinId = donorPinModel._id;
        layer.add(graphic);
        layer.popupTemplate = popupTemplate;

        return layer;
      };
    });

    return mapService;
  }
}());
