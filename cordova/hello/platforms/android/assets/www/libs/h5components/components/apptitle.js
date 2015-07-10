var mui = require('material-ui');


var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

mui.AppBar = require('../componentsmodifield/app-bar');

var HAppTitle = React.createClass({
    propTypes: {
        titleText: React.PropTypes.object.isRequired,
        iconClassNameRight: React.PropTypes.object,
        showMenuIconButton: React.PropTypes.bool,
        children: React.PropTypes.array,
        onLeftIconButtonTouchTap: React.PropTypes.func
    },
    mixins: [h5mixinprops],
    render: function () {

        if (!this.props.titleText)
            return console.error("Is necessary propreyty titleText in AppTitle");

        var propriedadesTraduzidas = this.getProps();

        var props = {};
        props.title = propriedadesTraduzidas.titleText;
        props.style = {position: "fixed"};
        props.iconClassNameRight = this.props.iconClassNameRight ? this.props.iconClassNameRight: null ;
        props.onLeftIconButtonTouchTap = this.props.onLeftIconButtonTouchTap ? this.props.onLeftIconButtonTouchTap: null ;
        props.children = this.props.children;

        delete props.titleText;

        return (React.createElement(mui.AppBar, props));
    }
});

module.exports = HAppTitle;
