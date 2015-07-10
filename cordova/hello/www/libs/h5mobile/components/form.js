var mui = require('material-ui');


var React = require('react');
require('../less/input.less');
var h5mixinprops = require('../mixins/h5mixinprops')

var hform = React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
    },
    mixins: [h5mixinprops],
    render: function () {
        if (!this.props.children) {
            return console.error("This component don't need a child");
        }
        if (!this.props.labelText) {
            return console.error("Add a label='Button Name'");
        }
        var propsTraduzidas = this.getProps();
        var titleForm = propsTraduzidas.labelText;
        var titulo = React.createElement('h2', {}, [titleForm, React.createElement('br'), React.createElement('br')]);


        var styleForm = {
            padding: "10px"
        };

        return (

            React.createElement('table', {width: "100%", cellSpacing:"10px", cellPadding: 0}, [this.props.children])
        )
    }

});

module.exports = hform;
