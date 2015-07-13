var mui = require('material-ui');

var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');

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

        var props = {};

        var state = this.props.store.getState();
        var value = state.editing[this.props.field];
        var error = state.editing_errors[this.props.field];


        if(this.props.validations){
            var required = this.props.validations.some(function(v){
                if(v)
                    return v.name == 'required';
            });
        }

        props.fullWidth = true;
        props.value = value;
        props.errorText = error ? error : ''
        props.name = this.props.field;
        props.onFocus = this.focus;
        props.style = {
              position: 'relative',
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.87)',
              font: 'inherit',
              boxSizing: 'border-box',
              paddingTop: '26px'
        };

        props.onChange = this.changed;
        if(state.validations && state.validations[this.props.field])
            props.onBlur = this.blur;

        var p = /(\d+)/.exec(this.props.className);
        var colspanx = p[1];


        var propstd = {
            colSpan: colspanx,
            style: {
                position: 'relative'
            }
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;
        var styleLabel = {}
        styleLabel = this.state.focus || props.value != '' ?
            {
              position: 'absolute',
              lineHeight: '22px',
              opacity: '1',
              color: this.state.focus ? 'rgb(0, 188, 212)' :  'rgba(0, 0, 0, 0.298039)',
              top: '15px',
              fontSize: '14px'
        } :
            {
              position: 'absolute',
              lineHeight: '22px',
              opacity: '1',
              color: 'rgba(0, 0, 0, 0.298039)',
              top: '38px'
        };


        return (React.createElement("td", propstd, [React.createElement('label', {style: styleLabel}, [
            this.state.focus || props.value != '' ? this.props.hintText : this.props.floatingLabelText]),
                React.createElement('input', props),
                React.createElement('hr', {style: {
                    border: 'none',
                    borderBottom: 'solid 1px #e0e0e0',
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
                      borderColor: 'rgb(0, 188, 212)',
                      transform: 'scaleX(1)'
                }}) : null]));
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
