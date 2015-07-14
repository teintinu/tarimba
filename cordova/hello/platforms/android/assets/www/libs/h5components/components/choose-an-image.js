var mui = require('material-ui');

var RaisedButton = mui.RaisedButton;
var FontIcon = mui.FontIcon;
var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops')

var ChooseAnImage = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func,
        children: React.PropTypes.object.isRequired
    },
    mixins: [h5mixinprops],
    render: function () {
        if (this.props.children) {
            return console.error("This component don't need a child");
        }

        if (!this.props.labelText) {
            return console.error("Add a label='Button Name'");
        }

        var styleInput = {
            cursor: 'pointer',
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            left: '0',
            width: '100%',
            opacity: '0'
        };

        var styleFlatButtonIcon = {
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle',
            float: 'left',
            paddingLeft: '12px',
            lineHeight: '36px',
            color: 'white'
        };

        var input = React.createElement('input', {
            type: 'file',
            style: styleInput,
            accept: "image/*"
        });


        var icon = React.createElement(FontIcon, {
            className: "fa fa-file-image-o",
            style: styleFlatButtonIcon
        });

        props.children = this.props.children;
        props.onTouchTap = this.props.onClick;

        delete props.labelText;

        return (
            React.createElement(RaisedButton, props, [icon, input])
        )
    }

});

module.exports = ChooseAnImage;
