'use strict';

/**
 * Module dependencies
 */
var donorpinsPolicy = require('../policies/donorpins.server.policy'),
  donorpins = require('../controllers/donorpins.server.controller');

module.exports = function(app) {
  // Donorpins Routes
  app.route('/api/donorpins').all(donorpinsPolicy.isAllowed)
    .get(donorpins.list)
    .post(donorpins.create);

  app.route('/api/donorpins/:donorpinId').all(donorpinsPolicy.isAllowed)
    .get(donorpins.read)
    .put(donorpins.update)
    .delete(donorpins.delete);

  // Finish by binding the Donorpin middleware
  // app.param('donorpinId', donorpins.donorpinByID);
  app.param('donorpinId', donorpins.donorpinByDiscreteID);
};
