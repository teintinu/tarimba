var React = require('react/addons');

window.React = React;

var Flux = require('flux');

var dispatcher = new Flux.Dispatcher();

window.ZscanApp = require('./stores/app.store.js');
window.zscanapp = ZscanApp.createStoreReference(dispatcher);

var view = require('./views/app/app.view.js').createViewReference(dispatcher);

React.render(React.createElement(view.Class), document.getElementById('app'));
