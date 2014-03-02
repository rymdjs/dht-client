(function() {

  'use strict';

  var DHT = {
    Verifier: Verifier
  };

  module.exports = window.DHT = DHT;

  var Q = require('q');

  function Verifier(options) {
    //TODO: HTTPS
    this.url = 'http://' + options.host + (options.port ? ':' + options.port : '');
    this.host = options.host;
    this.port = options.port;
    this.identity = null;
  }

  Verifier.prototype = function() {
    var lookupIdentity = function(identity) {
      var deferred = Q.defer();
      var endPointUrl = this.url + '/identities/' + identity;

      console.log("Looking up identity from URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('GET', endPointUrl);

      req.onload = function(e) {
        if (req.status === 200) {
          var res = JSON.parse( req.responseText );
          deferred.resolve(res);
        } else {
          deferred.reject(req.status);
        }
      };

      req.onerror = deferred.reject;

      req.send();

      return deferred.promise;
    };

    var registerEndpoint = function(endpoint) {
      var deferred = Q.defer();
      var endPointUrl = this.url + '/identities/' + this.identity + '/endpoints/' + endpoint;

      console.log("Trying to register endpoint with URL: " + endPointUrl);

      var req = new XMLHttpRequest();
      req.open('PUT', endPointUrl);

      req.onload = function(e) {
        if (req.status === 200) {
          deferred.resolve();
        }  else {
          console.log('endpoint register fail', req.status);
          deferred.reject(req.status);
        }
      };
      req.onerror = deferred.reject;

      req.send(JSON.stringify({
        host: this.host,
        port: this.port
      }));

      return deferred.promise;
    };

    return {
      lookupIdentity : lookupIdentity,
      registerEndpoint: registerEndpoint
    };
  }();

}).call(this);
