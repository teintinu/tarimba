var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');
var h5dropdown = require('../mixins/h5dropdown');
require('./style/menuleft.less');

var HMenuLeft = React.createClass({
    propTypes: {
        menuItems: React.PropTypes.array.isRequired,
        onClick: React.PropTypes.func.isRequired,
        refMenu: React.PropTypes.string.isRequired,
    },
    mixins: [h5mixinprops, h5dropdown],
    render: function () {
        if(this.isDropDown()){
            if (!this.props.menuItems)
                return console.error("Is necessary propreyty iconClassName in button");

            var props = this.getProps();

            var propsMenu = this.getPropsArray(this.props.menuItems);

            props.menuItems = this.trataLabelText(propsMenu);

            props.onChange = props.onClick;

            delete props.onClick;

            var propsMenuLateral = {};
            var propsOverlay = {};
            propsMenuLateral.className = 'h_menuLeft';

            propsOverlay.className = 'h_menuLeft_overlay';
            propsOverlay.onTouchTap = this.closeDropDown;
            return (
                React.createElement('div', {}, [React.createElement('div', propsMenuLateral,
                    [this.createItensMenu(props.menuItems)]), React.createElement('div', propsOverlay)])
            )
        }
        else
            return null;
    },
    createItensMenu: function(menuItems){
       return menuItems.map(function(item, index, array){
           var propsItemMenu = {};
           propsItemMenu.onTouchTap = function(e) {
               this.props.onClick(e, index, array[index]);
               this.closeDropDown();
           }.bind(this);

           propsItemMenu.className = 'itemMenuLeft'

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
