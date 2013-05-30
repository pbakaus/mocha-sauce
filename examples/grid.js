var Canvas = require('term-canvas'),
	size = process.stdout.getWindowSize(),
	MochaSauce = require('../index.js');

// configure cloud
var sauce = new MochaSauce({
	name: "Tasty chocolate",
	username: "pbakaus",
	accessKey: "00000000-0000-0000-0000-000000000000",
	host: "localhost",
	port: 4445,

	// the test url
	url: "http://localhost/oss/mocha-sauce/examples/test.html",

	// the current build name (optional)
	build: Date.now()
});

// enable this if you are debugging, disable in production for faster tests
sauce.record(true);

// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "firefox", platform: "Windows XP", version: "21" });
sauce.browser({ browserName: "internet explorer", platform: "Windows 8", version: "10" });
sauce.browser({ browserName: "internet explorer", platform: "Windows XP", version: "8" });
sauce.browser({ browserName: "firefox", platform: "Windows 8", version: "21" });

// clear terminal


// setup canvas to draw to, clear the terminal
var canvas = new Canvas(size[0], size[1]);
var ctx = canvas.getContext('2d');
ctx.reset();

// setup the grid
var grid = new MochaSauce.GridView(sauce, ctx);
grid.size(canvas.width, canvas.height);

// hide the cursor
ctx.hideCursor();

// trap SIGINT
process.on('SIGINT', function(){
	ctx.reset();
	process.nextTick(function(){
		process.exit();
	});
});

// output failure messages
// once complete, and exit > 0
// accordingly
sauce.start(function() {
	grid.showFailures();
	setTimeout(function() {
		ctx.showCursor();
		process.exit(grid.totalFailures());
	}, 100);
});