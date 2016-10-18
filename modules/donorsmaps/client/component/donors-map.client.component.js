(function () {
  'use strict';

  // Donorpins controller
  angular
    .module('donorpins')
    .component('donorsMap', {
      templateUrl: 'modules/donorsmaps/client/views/donors-map.client.view.html',
      controller: DonorsMap
    });

  DonorsMap.$inject = [
    '$templateRequest', '$sce', '$compile',
    '$scope', 'esriLoader', 'DonorpinsMapService',
    '$window', 'DonorpinsService', 'Socket',
    'MapSocketsService', 'MapPopupsService'
  ];

  function DonorsMap($templateRequest, $sce, $compile, $scope, esriLoader, DonorpinsMapService,
                     $window, DonorpinsService, Socket, MapSocketsService, MapPopupsService) {
    var self = this;
    self.mapSocketsService = MapSocketsService;
    self.donorpinMapService = DonorpinsMapService;

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
      // check that the device/browser can support WebGL
      //  by inspecting the userAgent and
      //  by handling the scene view directive's on-error
      // self.showViewError = browserDetectionService.isMobile();
      self.showViewError = false;
      self.onViewError = function () {
        self.showViewError = true;
      };

      // create the map for the esri-scene-view
      self.map = new Map({
        basemap: 'streets',
        zoom: 3
      });

      self.onViewCreated = function (view) {
        self.view = view;

        // add the analysis button's parent container to the view's UI,
        //  instead of relying on CSS positioning
        //  https://developers.arcgis.com/javascript/latest/api-reference/esri-views-ui-DefaultUI.html
        // self.view.ui.add('resultsDiv', 'top-right');
        self.viewLoaded = true;

        addSearchWidgetToMap();

        self.mapSocketsService.startListening(addDonorPinCallBack, removeDonorPinCallBack);
        self.addDonorPinCallBack = addDonorPinCallBack;
        self.view.on('click', handleMapClick);
        self.view.watch('extent', self.mapSocketsService.handleExtentChange);
      };

      function handleMapClick(evt) {
        self.view.hitTest(evt.screenPoint).then(function (response) {
          var graphics = response.results;
          // WE PICK ONLY THE MOST UPPER LAYER (VISIBLE)
          if (graphics
            && graphics.length > 0
            && graphics[0].hasOwnProperty('graphic')
            && graphics[0].graphic.hasOwnProperty('layer')
            && 'donorPinId' in graphics[0].graphic.layer) {
            MapPopupsService.showDonorPinPopupInformation(graphics[0]);
          } else {
            MapPopupsService.showCreateNewDonorPinPopup(evt, addDonorPinCreatedCallBack, $scope);
          }
        });
      }

      function addDonorPinCreatedCallBack(donorPinData) {
        var addedDonorPinLayer = self.donorpinMapService.getDonorPinLayer(donorPinData);
        self.map.add(addedDonorPinLayer);
        self.mapSocketsService.addDonorPinToStorage(donorPinData, addedDonorPinLayer);
      }

      function addDonorPinCallBack(addedDonorPinLayer) {
        self.map.add(addedDonorPinLayer);
      }

      function removeDonorPinCallBack(layerToRemove) {
        self.map.remove(layerToRemove);
      }

      function addSearchWidgetToMap() {
        var searchWidget = new Search({
          view: self.view
        });
        searchWidget.startup();

        // add the search widget to the top left corner of the view
        self.view.ui.add(searchWidget, {
          position: 'top-left',
          index: 0
        });

        // destroy the search widget when angular scope is also being destroyed
        $scope.$on('$destroy', function () {
          searchWidget.destroy();
        });
      }
    });
  }

}());
