var mui = require('material-ui');

var React = require('react');

var HIcon = require('./icon.js');
require('./style/floatingactionbutton.less');


var Hfloating = React.createClass({
    propTypes: {
        iconClassName: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired
    },
    mixins: [],
    render: function () {

        if (!this.props.iconClassName)
            return console.error("Is necessary propreyty iconClassName in button");

        var props_button = {};

        props_button.onTouchTap = this.props.onClick;
        props_button.className = 'h_floating_button';

        var props_icon = {};
        props_icon.iconClassName = this.props.iconClassName + ' h_floating_icon';

        var icon = React.createElement(HIcon, props_icon)
        return (React.createElement('div', props_button, icon));
    }

});

module.exports = Hfloating;
