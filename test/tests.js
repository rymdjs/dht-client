var should = chai.should();

describe('Verifier', function() {

	var verifier;

	beforeEach(function() {
		// Before asserts
		verifier = new DHT.Verifier({
			host: 'localhost',
			port: 3000
		});

		var requests = this.requests = [];
		var xhr = this.xhr = sinon.useFakeXMLHttpRequest();

		xhr.onCreate = function(req) {
			requests.push(req);
		};

	});

	describe('#lookupIdentity', function() {

		it('should send one request', function() {
			verifier.lookupIdentity('niklas');

			var requests = this.requests;

			requests.should.have.length(1);
		});

		it('should send request to the right url', function() {
			verifier.lookupIdentity('niklas');

			var requests = this.requests;

			requests[0].url.should.equal('http://localhost:3000/identities/niklas')
		});


		it('should send a GET request', function() {
			verifier.lookupIdentity('niklas');

			var requests = this.requests;

			requests[0].method.should.equal('GET');
		});

		it('should return results when response status 200', function(done) {
			var requests = this.requests;
			var response = JSON.stringify({ result: 'result' });

			var cb = function(res) {
				response.should.equal( JSON.stringify(res) );
				done();
			};

			verifier.lookupIdentity('niklas').then(cb);

			requests[0].respond(200, { 'Content-Type': 'application/json' }, response);
		});

		it('should reject when response status is not 200', function(done) {
			var requests = this.requests;

			var cb = function() {
				done();
			};

			verifier.lookupIdentity('niklas').fail(cb);

			requests[0].respond(500, {}, '');
		});

		after(function() {
			this.xhr.restore();
		});

	});

	describe('#registerEndpoint', function() {

		it('should send one request', function() {
			verifier.registerEndpoint(1);

			var requests = this.requests;

			requests.should.have.length(1);
		});

		it('should send request to the right url', function() {
			verifier.registerEndpoint(1);

			var requests = this.requests;

			requests[0].url.should.equal('http://localhost:3000/identities/niklas/endpoints/1')
		});


		it('should send a PUT request', function() {
			verifier.registerEndpoint(1);

			var requests = this.requests;

			requests[0].method.should.equal('PUT');
		});

		it('should resolve when response status 200', function(done) {
			var requests = this.requests;

			var cb = function(res) {
				done();
			};

			verifier.registerEndpoint(1).then(cb);

			requests[0].respond(200, { 'Content-Type': 'application/json' }, '');
		});

		it('should reject when response status is not 200', function(done) {
			var requests = this.requests;

			var cb = function() {
				done();
			};

			verifier.registerEndpoint(1).fail(cb);

			requests[0].respond(500, {}, '');
		});

		after(function() {
			this.xhr.restore();
		});


	});

});
