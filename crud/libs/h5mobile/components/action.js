require('./style/action.less');

var React = require('react');

var HAction = React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
        run: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
    },
    getInitialState: function(){
        return {
            clickedButton: null
        }
    },
    mixins: [],
    render: function () {

        var props = {};
        props.label = this.props.labelText;
        props.onTouchTap = this._click;
        props.style = this.props.style ? this.props.style : {};
        props.className = 'h_action ' + (this.state.clickedButton == 'h_action_' + this.props.labelText ? 'clicked' : null);


        return (React.createElement("button", props, [this.props.labelText]));
    },
    _click: function(e){
        this.setState({clickedButton: 'h_action_' + this.props.labelText});
        this.props.run();
        setTimeout(function(){
            this.setState({clickedButton: null});
        }.bind(this), 300)
    }
});

module.exports = HAction;
