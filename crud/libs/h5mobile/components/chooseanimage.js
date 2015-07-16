var mui = require('material-ui');

var RaisedButton = mui.RaisedButton;
var FontIcon = mui.FontIcon;
var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops')

require('./style/chooseanimage.less');

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


        var input = React.createElement('input', {
            type: 'file',
            className: 'h_chooseAnImage_input',
            accept: "image/*"
        });


        var icon = React.createElement(FontIcon, {
            className: "fa fa-file-image-o h_chooseAnImage_button"
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
