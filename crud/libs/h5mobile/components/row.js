var React = require('react');

var HRow = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired
    },
    render: function () {
        return (React.createElement('tr', {}, this.props.children));
    }
});

module.exports = HRow;
