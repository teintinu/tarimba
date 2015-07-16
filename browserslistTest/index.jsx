var React = require('react/addons');

window.React = React;

var view = require('./react-style-test');

React.render(React.createElement(view), document.getElementById('app'));
