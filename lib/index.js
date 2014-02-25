(function() {

  'use strict';

  // Reference to `window` in the browser and `exports`
  // on the server.
  var root = this;

  var Q = require('q');

  function DHT(options) {
    //TODO: HTTPS
    this.host = 'http://' + options.host + (options.port ? ':' + options.port || '');
  }

  DHT.prototype = function() {
    var verifyIdentity = function(identity) {
      var deferred = Q.defer();
      var endPointUrl = this.host + '/identities/' + identity;

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

    return {
      verifyIdentity : verifyIdentity
    };
  }();

  module.exports = DHT;
}).call(this);
