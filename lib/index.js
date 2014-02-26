(function() {

  'use strict';

  // Reference to `window` in the browser and `exports`
  // on the server.
  //var root = this;

  var Q = require('q');

  function Verifier(options) {
    //TODO: HTTPS
    this.host = 'http://' + options.host + (options.port ? ':' + options.port : '');
    this.identity = null;
  }

  Verifier.prototype = function() {
    var lookupIdentity = function(identity) {
      var deferred = Q.defer();
      var endPointUrl = this.host + '/identities/' + identity;

      console.log("Looking up identity from URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('GET', endPointUrl);

      req.onload = function(e) {
        var res = JSON.parse( this.response );
        if (this.status === 200) {
          deferred.resolve(res);
        }
      };

      req.send();

      return deferred.promise;
    };

    var registerEndpoint = function(endpoint) {
      var deferred = Q.defer();
      var endPointUrl = this.host + '/identities/' + this.identity + '/endpoints/' + endpoint;

      console.log("Trying to register endpoint with URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('PUT', endPointUrl);

      req.onload = function(e) {
        var res = this.response;
        if (this.status === 200) {
          deferred.resolve();
        }  else {
          deferred.reject(this.status);
        }
      };
      req.onerror = deferred.reject;

      req.send(JSON.stringify({}));

      return deferred.promise;
    };

    return {
      lookupIdentity : lookupIdentity,
      registerEndpoint: registerEndpoint
    };
  }();

  module.exports = {
    Verifier: Verifier
  }

}).call(this);
