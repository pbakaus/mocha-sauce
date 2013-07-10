# Mocha Sauce

> Put more mocha in that sauce, it's delicious!

## Overview

**Mocha Sauce is a node.js module that runs Mocha unit tests in the cloud using Sauce Connect or OnDemand**. Mocha Sauce was initially forked and heavily inspired by [mocha-cloud](https://github.com/visionmedia/mocha-cloud) and uses a similar external API to be able to seemlessly connect to the pre-bundled and bugfixed version of [mocha-cloud-grid-view](https://github.com/visionmedia/mocha-cloud-grid-view).

### Warning!

**Mocha Sauce is not stable**. It's bleeding edge and will probably have rough edges. It's experimental and not an officially supported Zynga OSS project yet.
That being said, we use it internally and are pretty happy, and the code should be generic enough to be used in the outside world.

### Should I use this?

If you need to unit test a web site, app or game that runs in the browser and want to test it in different environments using Sauce Labs (or another wd-compatible service), the answer is probably **yes**.

If you want to test node.js code, the answer is **no**. Mocha Sauce uses node, but does not test code in a node.js environment.

### Dependencies

- Mocha 1.9.0 (newer versions break mocha-phantomjs right now)
- Lots of other stuff (see package.json)

### Features

**Mocha Sauce** does what mocha-cloud does, only a little more, and with a little more flexibility. Here goes the list of improvements and additions:

- **supports Sauce Connect**
- **Automatic access to xUnit and JSON coverage**
- **Automagic compatibility with [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs)**
- compatible with [Sauce OnDemand Jenkins](https://saucelabs.com/docs/jenkins) plugin
- supports build flag to mark a specific build
- supports limiting the concurrency of executed VMs (some Sauce Labs plans don't allow more than 2 VMs to run at the same time)
- can disable video and screenshots in Sauce for faster test processing
- passes extended test coverage back to Sauce for full integration

## Install

Mocha Sauce isn't stable yet so it's not on npm's central repository. Worry not though, installing it is easy:

    $ npm install git://github.com/pbakaus/mocha-sauce.git
    
You can also put the git url into your package.json dependencies and any time you then call `npm install`, it will refresh to the latest version.

## Setup

### 1. Set up your test page

Follow the instructions at [Mocha's overview page](http://visionmedia.github.io/mocha/#browser-support) to make your tests run in the browser. When you got it all running, install mocha-sauce and alter your code slightly:

1. Include the client.js file from wherever mocha-sauce is installed:
   
   ```
   <script src="./node_modules/mocha-sauce/client.js"></script>
   ```

2. Remove this code block from the Mocha example:

   ```
   <script>
     mocha.checkLeaks();
     mocha.globals(['jQuery']);
     mocha.run();
   </script>
   ```

   and replace it with

   ```
   mochaSaucePlease();
   ```

   That last function call will start the test suite, so make sure to have all your dependencies loaded before executing it.


### 2. Setup your test runner

```
var MochaSauce = require("../index.js");

// configure
var sauce = new MochaSauce({
	name: "project", // your project name
	username: "username", // Sauce username
	accessKey: "00000000-0000-0000-0000-000000000000", // Sauce access key
	host: "localhost", // or http://ondemand.sauce.com if not using Sauce Connect
	port: 4445, // 80

	// the test url
	url: "http://localhost/test" // point to the site running your mocha tests
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
```

The above is a very basic example. For a more advanced example that uses a super nice grid view, check out `examples/grid.js`.

Save this file somewhere, call it however you want. I'll choose `runner.js`.

### 3. Run!

    $ node runner.js


## API

### Overview

- `new MochaSauce(settings)`
   
   *Instantiates a new test runner. Available options:*

   - `name` (required) *the name of the project to test*
   - `username` (required) *your Sauce Labs username*
   - `accessKey` (required) *your Sauce Labs Access Key*
   - `host` *the host the Sauce service runs on (if using Sauce Connect, this is localhost)*
   - `port` *the port the Sauce service runs on (if using Sauce Connect, this is 4445)*
   - `url` *url pointing to the site running your tests*
   - `build` *an identifier for the build*
   - `tags` *an optional array of tags*
   
- `MochaSauce.browser(settings)`
   
   *Adds a new browser to test on. Available options:*
   
   - `browserName`
   - `platform`
   - `version`
   
   See [Sauce Labs' platforms doc](https://saucelabs.com/docs/platforms) for available configurations. 
- `MochaSauce.start(fn)`
   
   *Instantiates all VMs and runs the tests. The optional callback is fired when all VMs have ended executing.*
- `MochaSauce.build(build)` - *Set the build string. Can also be done during instantiation.*
- `MochaSauce.tags(tags)` - *Set the tags (array of strings). Can also be done during instantiation.*
- `MochaSauce.url(url)` - *Set the url pointing to the site that runs the mocha tests. Can also be done during instantiation.*
- `MochaSauce.concurrency(num)` - *Limit the number of concurrent VMs to the number given. Very useful, as some of Sauce Labs' plans don't allow you to execute an unlimited amount of VMs at the same time.*
- `MochaSauce.record(video, screenshots?)` - *Disable or enable the recording of video and screenshots at Sauce Labs. By default they are disabled to make tests through Sauce execute faster, but if you have a lot of visual activity in your unit tests (or want to debug why your test site isn't loading through the VMs), enable these.*

### Using Sauce Connect

[Sauce Connect](https://saucelabs.com/docs/connect) is an extremely useful service that builds a tunnel from your local system to Sauce Labs' VMs, which then allows you to test firewalled or local urls.

To use it, first download the Sauce Connect client and make sure it is running, then use `localhost` as **host** and `4445` as **port** when instantiating your MochaSauce runner.

That's it – your tests will now run in a local tunnel and can access all urls you can access on your computer!


### Run your tests in PhantomJS

Mocha Sauce supports [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) out of the box, so you don't need to follow their usage instructions on setting up your HTML page.

To run your test site via PhantomJS, install mocha-phantomjs first using `$ npm install mocha-phantomjs`, then run the following:

    $ ./node-modules/.bin/mocha-phantomjs http://path/to/your/testsite.html

### Access JSON and XUnit reports

Mocha has a lot of built-in reporters but most of them only work on node.js. mocha-phantomjs supports a few of them, but tunneling the reports from the remote browsers running in Sauce VMs to your node client isn't simple.

Luckily, we automatically generate two reports for you: **xUnit** and **JSON**.

To access them, simply listen to the "end" event on your MochaSauce instance:

```
sauce.on('end', function(browser, res) {
  console.log(res.xUnitReport); // the xUnit XML report
  console.log(res.jsonReport); // the Jasmine-style JSON report
});
```

Note: The JSON report is *not* the same as the one of the default JSON reporter in Mocha. It's Jasmine-coverage style, making it easy [to be fed directly](https://saucelabs.com/docs/javascript-unit-tests-integration) to Sauce (we do this automatically for you).

### CI with Jenkins

Mocha Sauce is automatically compatible with Sauce Lab's Jenkins plugin. [Follow these instructions](https://saucelabs.com/jenkins) to get started.

When Sauce Connect is enabled for your Jenkins job, the plugin will expose a number of environment variables to whatever shell is running tasks. Luckily, **Mocha Sauce reads these environment variables automatically**.

So in its easiest form, if you just want to run your runner.js in Jenkins, just omit the username, accessKey, host and port settings:

```
var sauce = new MochaSauce({
	name: "project",

	// the test url
	url: "http://localhost/test",

	// the current build name (optional)
	build: Date.now()
});
```

Yes, it's that simple!

### Use Sauce Labs' test coverage reports

Mocha Sauce is [fully integrated](https://saucelabs.com/docs/javascript-unit-tests-integration) with Sauce and reports pass/fail status plus extended test coverage back to Sauce Labs.

In your Sauce labs job summary table, you will see the pass/fail status of every executed job, and when you click on one of the job reports and click on the **JS Unit Tests** tab to bring up a full test report.


## Credit, Copyright & License

Original credit and many thanks goes of course to [TJ Holowaychuk](https://github.com/visionmedia), who created mocha and the original mocha-cloud.

Mocha-sauce is licensed under MIT, and Copyright 2013 Zynga / Paul Bakaus.

Follow [@pbakaus](http://twitter.com/pbakaus) on Twitter for the latest news on mocha-sauce and other random stuff.