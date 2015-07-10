var mui = require('material-ui');

var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

var HIcon = require('./icon.js');

var Hfloating = React.createClass({
    propTypes: {
        iconClassName: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired
    },
    mixins: [h5mixinprops],
    render: function () {

        if (!this.props.iconClassName)
            return console.error("Is necessary propreyty iconClassName in button");

        var props_button = {};

        if (this.props.iconClassName == "hpencil")
            props_button.iconClassName = "fa fa-pencil fa-fw";
        if (this.props.iconClassName == "hpencil_spin")
            props_button.iconClassName = "fa fa-pencil fa-fw fa-spin";

        props_button.onTouchTap = this.props.onClick;
        props_button.style = {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex:'100'
        }

        var props_icon = {};
        props_icon.iconClassName = this.props.iconClassName;
        props_icon.style = { //colocando style no icon
            lineHeight: "2.2",
            height: '56px',
            color: 'white'

        }

        var icon = React.createElement(HIcon, props_icon)
        return (React.createElement(mui.FloatingActionButton, props_button, icon));
    }

});

module.exports = Hfloating;
