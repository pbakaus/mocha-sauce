var Cloud = require("../index.js");

// configure cloud
var cloud = new Cloud({
	name: "WTF",
	username: "pbakaus",
	accessKey: "e7b171df-435b-41a4-8ab3-9abacf2f70e6",
	host: "localhost",
	port: 4445,

	// the test url
	url: "http://localhost.zynga.com/wtf/test/unit/"
});


// setup what browsers to test with
cloud.browser({ browserName: "chrome", platform: "Windows 7" });
cloud.browser({ browserName: "firefox", platform: "Windows XP" });


cloud.on('init', function(browser) {
  console.log('  init : %s %s', browser.browserName, browser.platform);
});

cloud.on('start', function(browser) {
  console.log('  start : %s %s', browser.browserName, browser.platform);
});

cloud.on('end', function(browser, res) {
  console.log('  end : %s %s : %d failures', browser.browserName, browser.platform, res.failures);
});

cloud.start();
