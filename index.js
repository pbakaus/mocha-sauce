/**
 * This is alpha and probably NOT stable. Use at your own risk.
 *
 * It's also heavily inspired/stolen from mocha-cloud (https://github.com/visionmedia/mocha-cloud) and
 * uses a similar API to connect safely to mocha-cloud-grid-view.
 *
 * Copyright 2013 Paul Bakaus, licensed under MIT
 * "mocha-cloud" is Copyright 2013 TJ Holowaychuk
 */

var wd = require('wd'),
	Emitter = require('events').EventEmitter,
	debug = require('debug')('mocha-sauce'),
	Batch = require('batch'),
	request = require('request');

function Cloud(conf) {

	this.name = conf.name;
	this.user = conf.username || process.env.SAUCE_USER_NAME;
	this.key = conf.accessKey || process.env.SAUCE_API_KEY;
	this.host = conf.host || process.env.SELENIUM_HOST || "ondemand.saucelabs.com";
	this.port = conf.port || process.env.SELENIUM_PORT || 80;

	this.browsers = [];

	this._url = conf.url || '';
	this._concurrency = 2;
	this.tags = conf.tags || [];
	this.build = conf.build || '';

}

Cloud.prototype.__proto__ = Emitter.prototype;

Cloud.prototype.build = function(build) {
	this._build = build;
	return this;
};

Cloud.prototype.tags = function(tags) {
	this._tags = tags;
	return this;
};

Cloud.prototype.url = function(url) {
	this._url = url;
	return this;
};

Cloud.prototype.concurrency = function(num) {
	this._concurrency = num;
	return this;
};

Cloud.prototype.browser = function(conf) {
	debug('add %s %s %s', conf.browserName, conf.version, conf.platform);
	conf.version = conf.version || '';
	this.browsers.push(conf);
};

Cloud.prototype.start = function(fn) {

	var self = this;
	var batch = new Batch();
	fn = fn || function() {};

	batch.concurrency(this._concurrency);

	this.browsers.forEach(function(conf) {
		conf.tags = self.tags;
		conf.name = self.name;
		conf.build = self.build;

		// disable Sauce features not needed for unit tests (video + screenshot recording)
		conf['record-video'] = false;
		conf['record-screenshots'] = false;

		batch.push(function(done) {

			// initialize remote connection to Sauce Labs
			debug('running %s %s %s', conf.browserName, conf.version, conf.platform);
			var browser = wd.remote(self.host, self.port, self.user, self.key);
			self.emit('init', conf);

			browser.init(conf, function() {

				debug('open %s', self._url);
				self.emit('start', conf);

				browser.get(self._url, function(err) {
					if (err) return done(err);

					function wait() {
						browser.eval('window.mochaResults', function(err, res){
							if (err) return done(err);

							if (!res) {
								debug('waiting for results');
								setTimeout(wait, 1000);
								return;
							}

							debug('results %j', res);

							// update Sauce Labs with custom test data
							var data = {
								'custom-data': { mocha: res.jsonReport },
								'passed': !res.failures
							};

							request({
								method: "PUT",
								uri: ["https://", self.user, ":", self.key, "@saucelabs.com/rest", "/v1/", self.user, "/jobs/", browser.sessionID].join(''),
								headers: {'Content-Type': 'application/json'},
								body: JSON.stringify(data)
							}, function (/*error, response, body*/) {

								self.emit('end', conf, res);
								browser.quit();
								done(null, res);

							});

						});
					}

					wait();

				});
			});
		});
	});

	batch.end(fn);

};

module.exports = Cloud;