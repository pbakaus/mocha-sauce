var MochaSauce = require("../index.js");

// configure cloud
var sauce = new MochaSauce({
	name: "Tasty chocolate",
	username: "pbakaus",
	accessKey: "00000000-0000-0000-0000-000000000000",
	host: "localhost",
	port: 4445,

	// the test url
	url: "http://localhost/oss/mocha-sauce/examples/test.html"
});

sauce.record(true);

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
//sauce.browser({ browserName: "ipad", platform: "OS X 10.8", version: "6" });
//sauce.browser({ browserName: "internet explorer", platform: "Windows 8", version: "10" });

sauce.on('init', function(browser) {
  console.log('\tinit\t: %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('\tstart\t: %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('\tend\t: %s %s: %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start(function(err, res) {
	if(err) {
		console.log(err);
	}

	// res is an array, iterate over it and .browser tells you which
	// browser the results are for.
	//console.log(res[0].browser);

	// A full report in xUnit syntax (useful for CI integration)
	//console.log(res[0].xUnitReport);

	// A full report in Jasmine-style JSON syntax
	//console.log(res[0].jsonReport);

});
