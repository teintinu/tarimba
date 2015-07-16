var mui = require('material-ui');

var React = require('react');
//require('../less/input.less');
var h5mixinprops = require('../mixins/h5mixinprops');

var HSelect = React.createClass({

    mixins: [h5mixinprops],
    propTypes: {
        menuItems: React.PropTypes.array.isRequired,
        store: React.PropTypes.object.isRequired,
        floatingLabelText: React.PropTypes.string.isRequired,
        hintText: React.PropTypes.string.isRequired,
        field: React.PropTypes.string.isRequired,
        validations: React.PropTypes.array
    },
    render: function () {

        if (!this.props.className)
            return console.error("Is necessary propreyty className in select");

        if (!this.props.menuItems)
            return console.error("Is necessary propreyty menuItens in select");

        if (!this.props.floatingLabelText)
            return console.error("Is necessary propreyty floatingLabelText in select");

        var props = {};

        var p = /(\d+)/.exec(this.props.className);
        if (p)
            var colspanx = p[1];

        delete props.className;
        var propstd = {
            colSpan: colspanx
        };

        if (this.props.rowSpan)
            propstd.rowSpan = this.props.rowSpan;

        var state = this.props.store.getState();
        var value = state.editing[this.props.field];
        var error = state.editing_errors[this.props.field];

        props.style = {
            width: "100%"
        };
        props.fullWidth = true;
        props.value = value;
        props.errorText = error ? error : ''

        props.menuItems = this.props.menuItems;
        props.name = this.props.field;
        props.floatingLabelText = this.props.floatingLabelText;
        props.hintText = this.props.hintText;
        props.onChange = this.changed;
        props.onBlur = this.props.validations ? this.validate : null;

        return (React.createElement("td", propstd, React.createElement(mui.SelectField, props)));
    },
    changed: function (ev) {
        var editing = this.props.store.getState().editing;
        editing[this.props.field] = ev.target.value.payload;
        this.setState({});
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
    }

});

module.exports = HSelect;
