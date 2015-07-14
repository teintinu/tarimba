var React = require('react');
var LESS = require('react-style').create;

var css = LESS`
    .classe {
        width: '100px',
        heigth: '200px',
        background-color: red
    }
`;

css = JSON.parse(css);

var Test = React.createClass({
    render: function(){
        return React.createElement('div',  {style: css.classe}, 'blb');
    }
});

module.exports = Test;
