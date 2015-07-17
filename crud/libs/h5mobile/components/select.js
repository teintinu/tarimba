var mui = require('material-ui');

var React = require('react');
require('./style/select.less');
var h5mixinprops = require('../mixins/h5mixinprops');
console.warn = console.error;
var HSelect = React.createClass({

    mixins: [h5mixinprops],
    propTypes: {
        menuItems: React.PropTypes.array.isRequired,
        store: React.PropTypes.object.isRequired,
        labelText: React.PropTypes.string.isRequired,
        hintText: React.PropTypes.string.isRequired,
        field: React.PropTypes.string.isRequired,
        validations: React.PropTypes.array,
        colSpan: React.PropTypes.number
    },
    getInitialState: function(){
        return {
            focus:  false
        };
    },
    render: function () {

        var props = {};

        var propstd = {
            colSpan: this.props.colSpan || 1,
            rowSpan: this.props.rowSpan || 1,
            className: 'h_select_td',
            onTouchTap: this.focus,

        };

        var state = this.props.store.getState();
        var value = state.editing[this.props.field];
        var error = state.editing_errors[this.props.field];

        props.value = value ? value : 0;
        props.errorText = error ? error : ''

        var menuItems = this.props.menuItems.map(function(item, idx){
            var ret = [];
            if(idx == 0){
                ret.push(<option className='h_select_option' value={0}></option>);
            }
            ret.push(<option className='h_select_option' value={item._id}>{item.display}</option>);
            return ret
        });
        props.className = 'h_select'
        props.name = this.props.field;
        props.labelText = this.props.labelText;
        props.hintText = this.props.hintText;
        props.onChange = this.changed;
        props.onBlur = this.blur;
        props.onFocus = this.focus;

         var classNameLabel = this.state.focus || props.value != '0' ?
             'h_Input_LabelComValue ' + (this.state.focus ? error ? 'erro' : 'focus' :  error ? 'erro' : '') :
            'h_Input_LabelSemValue ' + (error ? 'erro' : '');


        return (React.createElement("td", propstd, [
                     React.createElement('label', {className: classNameLabel}, [this.props.labelText]),

             !props.value && this.state.focus || props.value == '0' && this.state.focus ?
                  React.createElement('label', {className: ('h_select_LabelSemValue ' + (error ? 'erro' : ''))},
                         [this.props.hintText]) : null,


                    React.createElement('select', props, [menuItems]),

                React.createElement('hr', {className: 'h_select_hr '+(error ? 'h_select_hr_error' : '')}),

                this.state.focus ? React.createElement('hr', {
                      className: 'h_select_hr_focus ' + (error ? 'h_select_hr_focus_error' : '') }) : null]));
    },
    changed: function (ev) {
        var editing = this.props.store.getState().editing;
        editing[this.props.field] = ev.target.value;
        this.setState({});
    },
    focus: function(e){
        this.setState({focus: true})
    },
    validate: function (ev) {
        var state = this.props.store.getState();
        var editing = state.editing;
        editing[this.props.field] = ev.target.value;
        if (!this.props.validations.some(function (v) {
                var error = v(this.props.field, this.props.labelText, ev.target.value);
                if (error) {
                    state.editing_errors[this.props.field] = error;
                    return true;
                }
                return false;
            }.bind(this)))
            delete state.editing_errors[this.props.field];
        this.setState({});
    },
    blur: function (ev) {
        this.setState({focus: false});
    }

});

module.exports = HSelect;
