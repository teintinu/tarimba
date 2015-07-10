'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var mui = require('material-ui');
var StylePropable = mui.Mixins.StylePropable;
var Transitions = mui.Styles.Transitions;
var Spacing = mui.Styles.Spacing;
var ClickAwayable = mui.Mixins.ClickAwayable;
var IconButton = mui.IconButton;
var Menu = mui.Menu;

var DropDownIcon = React.createClass({
  displayName: 'HDropDownIcon',

  mixins: [StylePropable, ClickAwayable],

  propTypes: {
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired,
    closeOnMenuItemTouchTap: React.PropTypes.bool,
    iconStyle: React.PropTypes.object,
    iconClassName: React.PropTypes.string,
    iconLigature: React.PropTypes.string
  },

  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      closeOnMenuItemTouchTap: true
    };
  },

  componentClickAway: function componentClickAway() {
    this.setState({ open: false });
  },

  getStyles: function getStyles() {
      var menuStyle;
      if(this.props.menuStyle)
          menuStyle = this.props.menuStyle;

    var iconWidth = 48;
    var styles = {
      root: {
        display: 'inline-block',
        width: iconWidth + 'px !important',
        position: 'relative',
        height: Spacing.desktopToolbarHeight,
        fontSize: Spacing.desktopDropDownMenuFontSize,
        cursor: 'pointer'
      },
      menu: {
        transition: Transitions.easeOut(),
        right: !menuStyle ? '-14px' : menuStyle.right + " !important",
        top: !menuStyle ? "9px" : menuStyle.top + " !important",
        marginRigth: this.state.open ? "-300px" : "",
        opacity: this.state.open ? 1 : 0,
        width: !menuStyle ? 'auto !important' : menuStyle.width + " !important"
      },
      menuItem: { // similair to drop down menu's menu item styles
        paddingRight: Spacing.iconSize + Spacing.desktopGutterLess * 2,
        height: Spacing.desktopDropDownMenuItemHeight,
        lineHeight: Spacing.desktopDropDownMenuItemHeight + 'px',

      }
    };
    return styles;
  },

  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;
    var menuItems = _props.menuItems;
    var closeOnMenuItemTouchTap = _props.closeOnMenuItemTouchTap;
    var iconStyle = _props.iconStyle;


    var iconClassName = _props.iconClassName;

    var other = _objectWithoutProperties(_props, ['style', 'children', 'menuItems', 'closeOnMenuItemTouchTap', 'iconStyle', 'iconClassName']);

    var styles = this.getStyles();

    return React.createElement(
      'div',
      _extends({}, other, { style: this.mergeAndPrefix(styles.root, this.props.style) }),
      React.createElement(
        'div',
        { onTouchTap: this._onControlClick },
        React.createElement(
          IconButton,
          {
            iconClassName: iconClassName,
            style: iconStyle },
          this.props.iconLigature
        ),
        this.props.children
      ),
      React.createElement(Menu, {
        ref: 'menuItems',
        style: this.mergeAndPrefix(styles.menu),
        menuItems: menuItems,
        menuItemStyle: styles.menuItem,
        hideable: true,
        visible: this.state.open,
        onItemTap: this._onMenuItemClick })
    );
  },

  _onControlClick: function _onControlClick() {
    this.setState({ open: !this.state.open });
  },

  _onMenuItemClick: function _onMenuItemClick(e, key, payload) {
    if (this.props.onChange) this.props.onChange(e, key, payload);

    if (this.props.closeOnMenuItemTouchTap) {
      this.setState({ open: false });
    }
  }
});

module.exports = DropDownIcon;
