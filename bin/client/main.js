// browserify.js (our library that clumps together all these javascript files)
// needs a "main file" to derive all dependencies from and package up.
// This is that file.
/// <reference path="../common/def/node.d.ts"/>
var React = require('react');
var ReactDOM = require('react-dom');
var AppComponent = require('./component/AppComponent.jsx');
ReactDOM.render(React.createElement(AppComponent), document.getElementById('content'));
