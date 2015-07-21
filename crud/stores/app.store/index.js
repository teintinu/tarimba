var React = require('react');

var Flux = require('flux');

var dispatcher = new Flux.Dispatcher();

var view = require('./app.view.js').createViewReference(dispatcher);

React.render(React.createElement(view.Class), document.getElementById('body'));

