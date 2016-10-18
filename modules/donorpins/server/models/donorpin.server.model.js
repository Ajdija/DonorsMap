'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  crypto = require('crypto'),
  validator = require('validator'),
  Schema = mongoose.Schema;

var validateEmail = function (email) {
  return validator.isEmail(email, {
    require_tld: false
  });
};

/**
 * Donorpin Schema
 */
var DonorpinSchema = new Schema({
  firstname: {
    type: String,
    required: 'First name is required',
    trim: true
  },
  lastname: {
    type: String,
    required: 'Last name is required',
    trim: true
  },
  contactnumber: {
    type: String,
    required: 'Contact number is required',
    validate: [
      /^(((\+|00)([0-9]{2})){1}[ ]{0,1}[0-9]{3}[ ]{0,1}[0-9]{4}[ ]{0,1}[0-9]{3})$/,
      'Contact number format must match +xx xxx xxxx xxx or 00xx xxx xxxx xxx'
    ],
    trim: true
  },
  emailaddress: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateEmail, 'Please fill a valid email address'],
    required: 'Email Address is required'
  },
  bloodgroup: {
    type: String,
    required: 'Blood Group is required',
    match: [
      /^((A|AB|B|0){1})$/,
      'The only valid blood groups are: A, B, AB, 0'
    ],
    trim: true
  },
  longitude: {
    type: Number,
    required: 'Longitude is required',
    min: [-180, 'Minimum longitude is -180'],
    max: [180, 'Maximum longitude is 180'],
    trim: true
  },
  latitude: {
    type: Number,
    required: 'Latitude is required',
    min: [-90, 'Minimum latitude is -90'],
    max: [90, 'Maximum latitude is 90'],
    trim: true
  },
  x: {
    type: Number,
    required: 'X map cord is required',
    trim: true
  },
  y: {
    type: Number,
    required: 'Y map cord is required.',
    trim: true
  },
  discreteIdentifier: {
    type: String,
    select: false,
    trim: true,
    index: {
      unique: true,
      sparse: true
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
});

DonorpinSchema.pre('save', function (next) {
  if (this.discreteIdentifier && this.isModified('discreteIdentifier')) {
    // Error - cannot modify this value.
    return false;
  }

  if (!this.discreteIdentifier) {
    this.discreteIdentifier = generateDiscreteIdentifier();
  }

  next();
});

function generateDiscreteIdentifier() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
mongoose.model('Donorpin', DonorpinSchema);
