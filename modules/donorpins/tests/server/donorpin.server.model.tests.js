'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Donorpin = mongoose.model('Donorpin'),
  _ = require('lodash');

/**
 * Globals
 */
var donorpinCorrect,
  donorpinEmpty;

/**
 * Unit tests
 */
describe('Donorpin Model Unit Tests:', function () {

  beforeEach(function (done) {
    donorpinCorrect = new Donorpin({
      firstname: 'Mateusz',
      lastname: 'Grzesiukiewicz',
      contactnumber: '+001112222332',
      emailaddress: 'ajdija@gmail.com',
      bloodgroup: 'A',
      longitude: -82.438,
      latitude: 40.74,
      x: -8236413,
      y: 4973999.984576544
    });
    donorpinEmpty = new Donorpin({});

    done();
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      donorpinCorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save empty donorpin', function (done) {
      donorpinEmpty.save(function (err) {
        should.exist(err);
        return done();
      });
    });

    it('should show validation error for contactnumber 001112222332', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.contactnumber = '001112222332';
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Contact number format must match +xx xxx xxxx xxx or 00xx xxx xxxx xxx',
          err.errors.contactnumber.message);
        return done();
      });
    });

    it('should show validation error for email ajdija@@gmail.com', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.emailaddress = 'ajdija@@gmail.com';
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Please fill a valid email address',
          err.errors.emailaddress.message);
        return done();
      });
    });

    it('should successfully save for blood group A', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.bloodgroup = 'A';
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should successfully save for blood group B', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.bloodgroup = 'B';
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should successfully save for blood group AB', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.bloodgroup = 'AB';
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should successfully save for blood group 0', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.bloodgroup = '0';
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should show validation error for blood group ABA', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.bloodgroup = 'ABA';
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'The only valid blood groups are: A, B, AB, 0',
          err.errors.bloodgroup.message);
        return done();
      });
    });

    it('should successfully save for longitude 0', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.longitude = 0;
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should successfully save for latitude 0', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.latitude = 0;
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should successfully save for latitude 90', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.latitude = 90;
      donorpinIncorrect.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should show validation error for longitude 181', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.longitude = 181;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Maximum longitude is 180',
          err.errors.longitude.message);
        return done();
      });
    });

    it('should show validation error for longitude -181', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.longitude = -181;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Minimum longitude is -180',
          err.errors.longitude.message);
        return done();
      });
    });

    it('should show validation error for latitude -91', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.latitude = -91;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Minimum latitude is -90',
          err.errors.latitude.message);
        return done();
      });
    });

    it('should show validation error for latitude 91', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.latitude = 91;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Maximum latitude is 90',
          err.errors.latitude.message);
        return done();
      });
    });

    it('should show validation error for x undefined', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.x = undefined;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'X map cord is required',
          err.errors.x.message);
        return done();
      });
    });

    it('should show validation error for y undefined', function (done) {
      var donorpinIncorrect = donorpinCorrect;
      donorpinIncorrect.y = undefined;
      donorpinIncorrect.save(function (err) {
        should.exist(err);
        should.exist(err.errors);
        should.equal(1, _.size(err.errors));
        should.equal(
          'Y map cord is required.',
          err.errors.y.message);
        return done();
      });
    });
  });

  afterEach(function (done) {
    done();
  });
});
