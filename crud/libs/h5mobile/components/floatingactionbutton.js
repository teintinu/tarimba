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
            zIndex:'100',
            border: '10px',
            background: 'none',
            display: 'inline-block',
            font: 'inherit',
            fontFamily: 'Roboto, sans-serif',
            cursor: 'pointer',
            height: '56px',
            width: '56px',
            backgroundColor: '#ff4081',
            borderRadius: '50%'
        }

        var props_icon = {};
        props_icon.iconClassName = this.props.iconClassName;
        props_icon.style = { //colocando style no icon
            top: "18px",
            height: '29px',
            color: 'white',
            fontSize: '19px',
            left: '18px',
            position: 'absolute'
        }

        var icon = React.createElement(HIcon, props_icon)
        return (React.createElement('div', props_button, icon));
    }

});

module.exports = Hfloating;
