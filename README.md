Description
-----------

This is minimum boilerplate code for my TypeScript projects. It is targeted toward complex object-oriented applications in the browser or phone via PhoneGap, where TypeScript maintainability is important.

Set Up
------
Run the following from the root directory:

`npm install`
  
to install project dependencies into a folder called `node_modules`

And then:

`npm run-script serve`

To compile all TypeScript, and launch the main.js server located in the `server` directory, you can instead run:

`npm run-script make`

To just compile all TypeScript.

Methodology Overview
--------------------
Both Client and Server are written in TypeScript and ultimately compiled to JavaScript. This is cool because:

1. Both Client and Server can share code. For example the client and server both use a Pizza object for various functionality, we only need to write that object once (this kind of code I'm calling `common` and goes in the `src/common` directory).
2. We use NodeJS to run server code on a server computer
3. We use Browserify to scoop up all the seperate JavaScript files and bundle them into one JavaScript include for the browser platform.


Directory Breakdown
-------------------

There are three directories in the source:

1. `src/server` - This contains all code only pertaining to the server side application. If there is no server, you can safely delete this directory and remove `express` as a dependency.
2. `src/client` - This contains all code only pertaining to the client side application. Browserify is used with the start point `client/main.ts` to scoop up all client code and bundle it into `client/static/js/main.js`
3. `src/common` - This contains all code that is shared by both client and server. Including files such as typescript definitions. NodeJS processes dependencies on its own via support for `require()`, so any `src/server` code that depends on common code will do so automatically. `src/client` code will scoop up common code via the same mechanism, but employed by Browserify.
4. `src/vendor` - This contains all JS source that is not available via NPM.

Unit Testing
------------

Unit testing is done with NodeUnit and is available immediately by running `npm run-script test`. Tests should reside in static TypeScript classes as per NodeUnit standards such that each static function is one unit test. Test files are automatically recognized if they end with the postfix `-test.ts`.

Vendors
-------

Vendor files are files that do not naturally belong to the application, but need to be used (e.g. libraries). If a library has an equivalent NPM package, you can just use `require()` as normal after installation via NPM and both the client and server will have support to get the dependency (the client via Browserify).

If the library is client and does not have a NPM package, you will need to place it in `src/vendor`.

GitIgnore
---------

The project is initially setup to ignore common ide files, and built JavaScript / map files. JavaScript files in the `src/common/vendor` directory are not ignored.

Development Style
-----------------

The application development style I follow is similar to many Java applications:

- Every class resides in their own TypeScript file
- Every class TypeScript file ends with an `export = ClassName;` statement to make itself available for import
- Every class that depends on another class, imports that class via `import ClassName = require('/path-to-class/ClassName');`
- Every class TypeScript file is named as `ClassName.ts`