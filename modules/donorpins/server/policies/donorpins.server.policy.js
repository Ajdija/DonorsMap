'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Donorpins Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/donorpins',
      permissions: '*'
    }, {
      resources: '/api/donorpins/:donorpinId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/donorpins',
      permissions: ['*']
    }, {
      resources: '/api/donorpins/:donorpinId',
      permissions: ['get', 'post', 'put']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/donorpins',
      // permissions: ['get']
      // Actually our donor pin assignment operates without users
      // so it is allowed for guests
      permissions: ['*']
    }, {
      resources: '/api/donorpins/:donorpinId',
      permissions: ['*']
    }]
  }]);
};

/**
 * Check If Donorpins Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Donorpin is being processed and the current user created it then allow any manipulation
  if (req.donorpin && req.user && req.donorpin.user && req.donorpin.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
