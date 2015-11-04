(function() {

  'use strict';

  var DHT = {
    Verifier: Verifier
  };

  module.exports = window.DHT = DHT;

  var Q = require('q');

  function Verifier(options) {
    //TODO: HTTPS
    this.host = 'http://' + options.host + (options.port ? ':' + options.port : '');
    this.silent = options.silent || true;
    this.identity = null;
  }

  Verifier.prototype = function() {
    var lookupIdentity = function(identity) {
      var deferred = Q.defer();
      var endPointUrl = this.host + '/identities/' + encodeURIComponent(identity);

      if(!this.silent)
        console.log("Looking up identity from URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('GET', endPointUrl);

      req.onload = function(e) {
        if (req.status === 200) {
          var res = JSON.parse( req.responseText );
          deferred.resolve(res);
        } else {
          deferred.reject(new Error(identity + " does not exist."));
        }
      };

      req.onerror = deferred.reject;

      req.send();

      return deferred.promise;
    };

    var registerEndpoint = function(endpoint) {
      var deferred = Q.defer();
      var endPointUrl = this.host + '/identities/' + encodeURIComponent(this.identity) + '/endpoints/' + encodeURIComponent(endpoint);

      if(!this.silent)
        console.log("Trying to register endpoint with URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('PUT', endPointUrl);

      req.onload = function(e) {
        if (this.status === 200) {
          deferred.resolve();
        }  else {
          deferred.reject(new Error(req.status));
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

}).call(this);
