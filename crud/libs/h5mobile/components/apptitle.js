var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

require('./style/apptitle.less');

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

        var propsAppTitle = {};
        propsAppTitle.className = 'h_appTitle';

        var propsH1 = {};
        propsH1.className = 'h_appTitle_h1';

        var propsMenuBar = {};
        propsMenuBar.className = 'fa fa-bars h_appTitle_menuBar';
        propsMenuBar.onTouchTap = this.props.onLeftIconButtonTouchTap;

        var title = React.createElement('h1', propsH1, propriedadesTraduzidas.titleText);
        var menuBar = React.createElement('span', propsMenuBar);

        return (React.createElement('div', propsAppTitle, [menuBar, title, this.props.children]))
    }
});

module.exports = HAppTitle;
