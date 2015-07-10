var mui = require('material-ui');


var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

mui.LeftNav = require('../componentsmodifield/left-nav');

var hdropDownState = {
    current: null
};

var hdropDown = {
    toggleDropDown: function(){
        if(this.isDropDown())
            this.closeDropDown();
        else
            this.openDropDown();
    },
    openDropDown: function(){
        var old = hdropDownState.current;
        hdropDownState.current = this;
        this.setState({});
        if(old)
            old.setState({});
    },
    closeDropDown: function(){
        if(hdropDownState.current == this)
            hdropDownState.current = null;
        this.setState({});
    },
    isDropDown: function(){
        return hdropDownState.current == this;
    }
};

var HMenuLeft = React.createClass({
    propTypes: {
        menuItems: React.PropTypes.array.isRequired,
        onClick: React.PropTypes.func.isRequired,
        refMenu: React.PropTypes.string.isRequired,
    },
    mixins: [h5mixinprops, hdropDown],
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
        if(this.isDropDown()){
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
            propsOverlay.onTouchTap = this.closeDropDown;
        }
        return (
            React.createElement('div', {}, [React.createElement('div', propsMenuLateral, [this.createItensMenu(props.menuItems)]), React.createElement('div', propsOverlay)])
        )
    },
    createItensMenu: function(menuItems){
       return menuItems.map(function(item, index, array){
           var propsItemMenu = {};
           propsItemMenu.onTouchTap = function(e) {
               this.props.onClick(e, index, array);
           };

          return (React.createElement('div', propsItemMenu, [
                item.text
          ]))
       }.bind(this));
    },
    toggle: function(e){
        this.toggleDropDown();
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
