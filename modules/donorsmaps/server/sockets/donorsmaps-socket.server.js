var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Donorpin = mongoose.model('Donorpin');

module.exports = function (io, socket) {
  var currentConnections = {};

  io.sockets.on('connection', function (client) {
    addClient(client);

    client.on('update donor pin', function (donorpin) {
      _.forIn(currentConnections, function (value, key) {
        if (isEligibleForUpdate(key, donorpin)) {
          if (io.sockets.connected[key]) {
            io.sockets.connected[key].emit('update donor pin', donorpin);
          }
        }
      });
    });

    client.on('remove donor pin', function (donorpin) {
      _.forIn(currentConnections, function (value, key) {
        if (isEligibleForUpdate(key, donorpin)) {
          if (io.sockets.connected[currentConnections[key].socketId]) {
            io.sockets.connected[currentConnections[key].socketId].emit('remove donor pin', donorpin);
          }
        }
      });
    });

    client.on('update client range', function (range) {
      if (isEligibleRange(range)) {
        currentConnections[client.id].range = range;

        // Need to query mongo for pins.
        Donorpin.find({
          x: {
            '$gte': currentConnections[client.id].range.xmin,
            '$lte': currentConnections[client.id].range.xmax
          },
          y: {
            '$gte': currentConnections[client.id].range.ymin,
            '$lte': currentConnections[client.id].range.ymax
          }
        }).exec(function (err, donorpins) {
          if (err) {
            console.log(errorHandler.getErrorMessage(err));
          }

          donorpins.forEach(function (donorpin, index, array) {
            if (io.sockets.connected[client.id]) {
              io.sockets.connected[client.id].emit('update donor pin', donorpin);
            }
          });
        });
      }
    });

    client.on('disconnect', function () {
      delete currentConnections[client.id];
    });
  });

  function addClient(client) {
    if (!(client.id in currentConnections)) {
      currentConnections[client.id] = {
        socketId: client.id
      };
    }
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function isEligibleRange(range) {
    return range &&
      range.xmin &&
      isNumber(range.xmin) &&
      range.ymin &&
      isNumber(range.ymin) &&
      range.xmax &&
      isNumber(range.xmax) &&
      range.ymax &&
      isNumber(range.ymax);

  }

  function isEligibleForUpdate(clientId, donorpin) {
    return currentConnections[clientId].range &&
      currentConnections[clientId].socketId &&
      donorpin.x && donorpin.y &&
      isNumber(donorpin.x) && isNumber(donorpin.y) &&
      donorpin.x < currentConnections[clientId].range.xmax &&
      donorpin.y < currentConnections[clientId].range.ymax &&
      donorpin.x > currentConnections[clientId].range.xmin &&
      donorpin.y > currentConnections[clientId].range.ymin;
  }
};
