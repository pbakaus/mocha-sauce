var Canvas = require('term-canvas'),
	size = process.stdout.getWindowSize(),
	MochaSauce = require('../index.js'),
	GridView = require('mocha-cloud-grid-view');


// configure cloud
var sauce = new MochaSauce({
	name: "project",
	username: "username",
	accessKey: "00000000-0000-0000-0000-000000000000",
	host: "localhost",
	port: 4445,

	// the test url
	url: "http://localhost/test",

	// the current build name (optional)
	build: Date.now()
});


// setup what browsers to test with
sauce.browser({ browserName: "chrome", platform: "Windows 7" });
sauce.browser({ browserName: "firefox", platform: "Windows XP" });

// clear terminal
console.log("\033[2J\033[0f");

// setup grid and canvas
var canvas = new Canvas(size[0], size[1]);
var ctx = canvas.getContext('2d');
var grid = new GridView(sauce, ctx);
grid.size(canvas.width, canvas.height);
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