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

        props.iconClassNameRight = this.props.iconClassNameRight ? this.props.iconClassNameRight: null ;
        props.onLeftIconButtonTouchTap = this.props.onLeftIconButtonTouchTap ? this.props.onLeftIconButtonTouchTap: null ;
        props.children = this.props.children;

        var propsAppTitle = {};
        propsAppTitle.style = {
            position: "fixed",
            backgroundColor: "#00bcd4",
            width: '100%',
            height: '64px',
            zIndex: '100'
        };

        var propsH1 = {};
        propsH1.style ={
            color: 'white',
            fontSize: '28px',
            left: '58px',
            top: '20px',
            position: 'fixed',
            font: 'normal normal normal 25px/1 FontAwesome'
        };

        var propsMenuBar = {};
        propsMenuBar.style = {
            color: 'white',
            position: 'fixed',
            top: '20px',
            fontSize: '24px',
            left: '20px',
            cursor: 'pointer'
        };

        propsMenuBar.className = 'fa fa-bars';

        var title = React.createElement('h1', propsH1, propriedadesTraduzidas.titleText);
        var menuBar = React.createElement('span', propsMenuBar);

        return (React.createElement('div', propsAppTitle, [menuBar, title, this.props.children]))
    }
});

module.exports = HAppTitle;
