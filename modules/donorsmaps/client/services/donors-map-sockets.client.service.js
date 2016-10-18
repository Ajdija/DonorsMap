// Donorpins service used to communicate Donorpins REST endpoints
(function () {
  'use strict';

  angular
    .module('donorpins')
    .factory('MapSocketsService', MapSocketsService);

  MapSocketsService.$inject = ['Socket', 'DonorpinsMapService'];

  function MapSocketsService(Socket, DonorpinsMapService) {
    var mapService = {};
    mapService.socket = Socket;
    mapService.donorPinStorage = {};
    mapService.addDonorPinCallBack = null;
    mapService.removeDonorPinCallBack = null;
    mapService.donorpinMapService = DonorpinsMapService;

    mapService.updateDonorPin = function updateDonorPin(donorpin) {
      if (donorpin && donorpin._id && donorpin.latitude && donorpin.longitude) {
        if ((donorpin._id in mapService.donorPinStorage) && mapService.donorPinStorage[donorpin._id].ref) {
          var ref = mapService.donorPinStorage[donorpin._id].ref;
          ref.firstname = donorpin.firstname;
          ref.lastname = donorpin.lastname;
          ref.emailaddress = donorpin.emailaddress;
          ref.contactnumber = donorpin.contactnumber;
          ref.bloodgroup = donorpin.bloodgroup;
          ref.longitude = donorpin.longitude;
          ref.latitude = donorpin.latitude;
          ref.x = donorpin.x;
          ref.y = donorpin.y;
        } else {
          var addedDonorPinLayer = mapService.donorpinMapService.getDonorPinLayer(donorpin);
          mapService.addDonorPinToStorage(donorpin, addedDonorPinLayer);
          mapService.addDonorPinCallBack(addedDonorPinLayer);
        }
      }
      // Ignore if invalid payload.
    };

    mapService.removeDonorPin = function removeDonorPin(donorpin) {
      if (donorpin && donorpin._id && donorpin.latitude && donorpin.longitude) {
        if (donorpin._id in mapService.donorPinStorage) {
          if (mapService.donorPinStorage[donorpin._id].pinLayer) {
            mapService.removeDonorPinCallBack(mapService.donorPinStorage[donorpin._id].pinLayer);
            delete mapService.donorPinStorage[donorpin._id].pinLayer;
          }
          if (mapService.donorPinStorage[donorpin._id].ref) {
            delete mapService.donorPinStorage[donorpin._id].ref;
          }
          delete mapService.donorPinStorage[donorpin._id];
        }
      }
    };

    mapService.addDonorPinToStorage = function addDonorPinToStorage(donorPinData, addedDonorPinLayer) {
      mapService.donorPinStorage[donorPinData._id] = {
        ref: donorPinData,
        pinLayer: addedDonorPinLayer
      };
    };

    mapService.startListening = function startListening(addDonorPinCallBack, removeDonorPinCallBack) {
      mapService.addDonorPinCallBack = addDonorPinCallBack;
      mapService.removeDonorPinCallBack = removeDonorPinCallBack;
      mapService.socket.on('update donor pin', mapService.updateDonorPin);
      // mapService.socket.on('remove donor pin', mapService.removeDonorPin);
    };

    mapService.handleExtentChange = function handleExtentChange(newExtent, oldExtent) {
      mapService.socket.emit('update client range', newExtent);
    };

    return mapService;
  }
}());
