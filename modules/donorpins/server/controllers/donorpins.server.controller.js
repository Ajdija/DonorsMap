'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Donorpin = mongoose.model('Donorpin'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Donorpin
 */
exports.create = function (req, res) {
  var donorpin = new Donorpin(req.body);

  donorpin.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donorpin);
    }
  });
};

/**
 * Show the current Donorpin
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var donorpin = req.donorpin ? req.donorpin.toJSON() : {};

  // Add a custom field to the Donorpin, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Donorpin model.
  donorpin.isCurrentUserOwner = req.user && donorpin.user && donorpin.user._id.toString() === req.user._id.toString();

  res.jsonp(donorpin);
};

/**
 * Update a Donorpin
 */
exports.update = function (req, res) {
  var donorpin = req.donorpin;

  donorpin = _.extend(donorpin, req.body);

  donorpin.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donorpin);
    }
  });
};

/**
 * Delete an Donorpin
 */
exports.delete = function (req, res) {
  var donorpin = req.donorpin;

  donorpin.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donorpin);
    }
  });
};

/**
 * List of Donorpins
 */
exports.list = function (req, res) {
  Donorpin.find().sort('-created').populate('user', 'displayName').exec(function (err, donorpins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(donorpins);
    }
  });
};

/**
 * Donorpin middleware
 */
exports.donorpinByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Donorpin is invalid'
    });
  }

  Donorpin.findById(id).populate('user', 'displayName').exec(function (err, donorpin) {
    if (err) {
      return next(err);
    } else if (!donorpin) {
      return res.status(404).send({
        message: 'No Donorpin with that identifier has been found'
      });
    }
    req.donorpin = donorpin;
    next();
  });
};

exports.donorpinByDiscreteID = function (req, res, next, id) {

  Donorpin.findOne({ discreteIdentifier: id }).select('+discreteIdentifier').populate('user', 'displayName').exec(function (err, donorpin) {
    if (err) {
      return next(err);
    } else if (!donorpin) {
      return res.status(404).send({
        message: 'No Donorpin with that discrete identifier has been found'
      });
    }
    req.donorpin = donorpin;
    next();
  });
};
