var Flux = require('flux');
var React = require('react/addons');
window.React = React;

var dispatcher = new Flux.Dispatcher();

var view = require('./listar.view.jsx').createViewReference(dispatcher);

React.render(React.createElement(view.Class),
            document.getElementById('app'));

function inicia(){
}

export default inicia;
