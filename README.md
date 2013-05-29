Mocha Sauce
===========

Mocha Sauce is a module that unit tests Mocha in the cloud using Sauce Connect or OnDemand.

Differences to mocha-cloud
--------------------------

Mocha sauce is heavily inspired by mocha-cloud and uses similar wrappers to be able to connect to mocha-cloud-grid-view. However, there are a number of additions and improvements:

- Sauce Connect support
- Sauce Connect Jenkins plugin compatible
- supports build flag
- supports limiting the concurrency of VMs
- disables video and screenshots in Sauce for faster test processing
- passes extended test coverage back to Sauce for full integration
- Automatic access to xUnit and JSON coverage

Setup instructions
------------------

Checkout the provided examples on how to setup the node.js code to execute the tests.

When setting up your test page, include the client.js file:

    <script src="./node_modules/mocha-sauce/client.js"></script>

Then when you loaded all your files, call the following function to execute the tests:

    runTestHarness();

That should do the job!

