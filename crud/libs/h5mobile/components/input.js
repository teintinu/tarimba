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
        propsInput.ref = 'h_input_'+this.props.field;
        propsInput.id= 'h_input_'+this.props.field;

        propsInput.onChange = this.changed;
        if(state.validations && state.validations[this.props.field])
            propsInput.onBlur = this.blur;

        var p = /(\d+)/.exec(this.props.className);
        var colspanx = p[1];


        var propstd = {
            colSpan: colspanx,
            className: 'h_input_td',
            onTouchTap: this.focus
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;

        var classNameLabel = this.state.focus || propsInput.value || propsInput.value != '' ?
             'h_Input_LabelComValue ' + (this.state.focus ? error ? 'erro' : 'focus' :  error ? 'erro' : '') :
            'h_Input_LabelSemValue ' + (error ? 'erro' : '');


        return (React.createElement("td", propstd, [

            React.createElement('label', {className: classNameLabel}, [this.props.floatingLabelText]),

             !propsInput.value && this.state.focus || propsInput.value == '' && this.state.focus ?
                  React.createElement('label', {className: ('h_Input_LabelSemValue ' + (error ? 'erro' : ''))},
                         [this.props.hintText]) : null,

                React.createElement('input', propsInput),

                React.createElement('hr', {className: 'h_input_hr '+(error ? 'h_input_hr_error' : '')}),

                this.state.focus ? React.createElement('hr', {
                      className: 'h_input_hr_focus ' + (error ? 'h_input_hr_focus_error' : '') }) : null],

                error ?
                React.createElement('span', {className: 'h_input_labelError'}, [error]) : null
            ));
    },
    changed: function (ev) {
        var editing = this.props.store.getState().editing;
        editing[this.props.field] = ev.target.value;
        this.setState({});
    },
    focus: function(e){
        this.setState({focus: true})
        var input = React.findDOMNode(this.refs['h_input_'+this.props.field]);
        input.focus();
        input.value = input.value;
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
