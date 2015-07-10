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
        props.floatingLabelText = required ?  "* " + this.props.floatingLabelText  : this.props.floatingLabelText;
        props.hintText = this.props.hintText;
        props.onChange = this.changed;
        if(state.validations && state.validations[this.props.field])
            props.onBlur = this.blur;

        var p = /(\d+)/.exec(this.props.className);
        var colspanx = p[1];

        delete props.className;

        var propstd = {
            colSpan: colspanx
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;

        return (React.createElement("td", propstd, React.createElement(mui.TextField, props)));
    },
    changed: function (ev) {
        var editing = this.props.store.getState().editing;
        editing[this.props.field] = ev.target.value;
        this.setState({});
    },
    blur: function (ev) {
        var state = this.props.store.getState();
        var editing = state.editing;
        editing[this.props.field] = ev.target.value;
        this.props.store.validate(this.props.field, ev.target.value);
        this.setState({});
    }

});

module.exports = HInput;
