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
    getInitialState: function(){
        return {
            open: false
        };
    },
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

        delete props.onClick;

        var propsMenuLateral = {};
        var propsOverlay = {};
        if(this.state.open){
            propsMenuLateral.style = {
                height: '100%',
                width: '256px',
                position: 'fixed',
                zIndex: '1000',
                left: '0px',
                top: '0px',
                overflow: 'hidden',
                backgroundColor: '#FFF'
            };

            propsOverlay.style = {
                position: 'fixed',
                height: '100%',
                width: '100%',
                zIndex: '999',
                top: '0px',
                left: '0px',
                opacity: '0.5',
                backgroundColor: '#000'
            };
            propsOverlay.onTouchTap = this.toggle;
        }
        return (
            React.createElement('div', {}, [React.createElement('div', propsMenuLateral, [this.createItensMenu(props.menuItems)]), React.createElement('div', propsOverlay)])
        )
    },
    createItensMenu: function(menuItems){
       return menuItems.map(function(item, index, array){
           var propsItemMenu = {};
           propsItemMenu.onTouchTap = this.props.onClick.bind(this, item, index, array);

          return (React.createElement('div', propsItemMenu, [
                item.text
          ]))
       }.bind(this));
    },
    toggle: function(e){
        this.setState({
            open: !this.state.open
        });
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
