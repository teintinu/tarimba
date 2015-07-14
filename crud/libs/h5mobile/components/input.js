var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');
require('./style/input.less');

var HInput = React.createClass({
    propTypes: {
        store: React.PropTypes.object.isRequired,
        floatingLabelText: React.PropTypes.string.isRequired,
        hintText: React.PropTypes.string.isRequired,
        field: React.PropTypes.string.isRequired,
    },
    getInitialState: function(){
       return {focus: false};
    },
    mixins: [h5mixinprops],
    render: function () {
        if (!this.props.store)
            return console.error("Is necessary propreyty state in input");

        var propsInput = {};

        var state = this.props.store.getState();
        var value = state.editing[this.props.field];
        var error = state.editing_errors[this.props.field];


        if(this.props.validations){
            var required = this.props.validations.some(function(v){
                if(v)
                    return v.name == 'required';
            });
        }

        propsInput.value = value;
        propsInput.errorText = error ? error : ''
        propsInput.name = this.props.field;
        propsInput.onFocus = this.focus;
        propsInput.className = 'h_input';

        propsInput.onChange = this.changed;
        if(state.validations && state.validations[this.props.field])
            propsInput.onBlur = this.blur;

        var p = /(\d+)/.exec(this.props.className);
        var colspanx = p[1];


        var propstd = {
            colSpan: colspanx,
            className: 'h_input_td'
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;
        var styleLabel = {}
        styleLabel = this.state.focus || propsInput.value || propsInput.value != '' ?
             'h_Input_LabelComValue ' + (this.state.focus ? error ? 'erro' : 'focus' :  error ? 'erro' : '') :
            'h_Input_LabelSemValue ' + (error ? 'erro' : '');


        return (React.createElement("td", propstd, [React.createElement('label', {className: styleLabel}, [
            this.state.focus || propsInput.value || propsInput.value != '' ? this.props.hintText : this.props.floatingLabelText]),
                React.createElement('input', propsInput),
                React.createElement('hr', {style: {
                    border: 'none',
                    borderBottom: error ? 'solid 1px red' : 'solid 1px #e0e0e0',
                    position: 'absolute',
                    width: '100%',
                    bottom: '8px',
                    margin: '0',
                    boxSizing: 'content-box',
                    height: '0'
                }}),
                this.state.focus ? React.createElement('hr', {style: {
                      borderStyle: 'none none solid',
                      borderBottomWidth: '2px',
                      position: 'absolute',
                      width: '100%',
                      bottom: '8px',
                      margin: '0px',
                      boxSizing: 'content-box',
                      height: '0px',
                      borderColor: error ? 'red' : 'rgb(0, 188, 212)',
                      transform: 'scaleX(1)'
                }}) : null],
                error ?
                React.createElement('label', {style: {
                  color: 'red',
                  fontSize: '10px',
                  bottom: '-10px',
                  position: 'absolute',
                  left: '0px'
                }}, [error]) : null
            ));
    },
    changed: function (ev) {
        var editing = this.props.store.getState().editing;
        editing[this.props.field] = ev.target.value;
        this.setState({});
    },
    focus: function(e){
        this.setState({focus: true})
    },
    blur: function (ev) {
        var state = this.props.store.getState();
        var editing = state.editing;
        editing[this.props.field] = ev.target.value;
        this.props.store.validate(this.props.field, ev.target.value);
        this.setState({focus: false});
    }

});

module.exports = HInput;
