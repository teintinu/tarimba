var mui = require('material-ui');


var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

mui.LeftNav = require('../componentsmodifield/left-nav');

var HMenuLeft = React.createClass({
    propTypes: {
        menuItems: React.PropTypes.array.isRequired,
        onClick: React.PropTypes.func.isRequired,
        refMenu: React.PropTypes.string.isRequired,
    },
    mixins: [h5mixinprops],
    render: function () {

        if (!this.props.menuItems)
            return console.error("Is necessary propreyty iconClassName in button");

        var props = this.getProps();

        var propsMenu = this.getPropsArray(this.props.menuItems);

        props.menuItems = this.trataLabelText(propsMenu);

        if(window.innerWidth > 750){
            props.style = {
                width: "180px",
                height: "100%",
                position: "fixed",
                marginTop: "65px",
                zIndex: '1000 !important'
            };
        }

        props.onChange = props.onClick;
        props.ref = this.props.refMenu;

        delete props.onClick;


        return (
            React.createElement(mui.LeftNav, props)
        )
    },
    toggle: function(e){
        this.refs[this.props.refMenu].toggle();
    },
    trataLabelText: function (propsMenu) {
        return propsMenu.map(function (prop) {
            prop.text = prop.labelText;
            delete prop.labelText;
            return prop;
        })
    }

});

module.exports = HMenuLeft;
