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


// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "firefox", platform: "Windows XP" });


sauce.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

sauce.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

sauce.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

sauce.start();
