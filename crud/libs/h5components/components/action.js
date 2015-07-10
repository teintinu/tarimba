var mui = require('material-ui');


var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

var HAction = React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
        run: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
    },
    mixins: [h5mixinprops],
    render: function () {

        var props = {};
        props.label = this.props.labelText;
        props.onTouchTap = this.props.run;
        props.style = this.props.style ? this.props.style : {};

        return (React.createElement(mui.RaisedButton, props));
    }
});

module.exports = HAction;
