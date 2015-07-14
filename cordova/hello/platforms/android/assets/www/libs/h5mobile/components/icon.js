var React = require('react');
var h5mixinprops = require('../mixins/h5mixinprops');
var h5dropdown = require('../mixins/h5dropdown');

var HIcon = React.createClass({
    propTypes: {
        iconClassName: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
        style: React.PropTypes.object,
    },
    mixins: [h5mixinprops, h5dropdown],
    render: function () {

        if (!this.props.iconClassName && !this.props.className)
            return console.error("Is necessary propreyty iconClassName or name in button");

        var props = {};
        if(this.props.name){
            if (this.props.name == "hpencil")
                props.className = "fa fa-pencil";
            else if (this.props.name == "hpencil_spin")
                props.className = "fa fa-pencil fa-spin";
            else if (this.props.name == "hamburger_pontos")
                props.className = "fa fa-ellipsis-v";
            else if (this.props.name == "excluir")
                props.className = "fa fa-times testImgBtn";
            else if (this.props.name == "salvar")
                props.className = "fa fa-floppy-o testImgBtn";
            else
                props.className = this.props.name;
        }
        else if(this.props.className)
            props.className = this.props.className;
        else
            props.className = this.props.iconClassName;
        props.style = this.props.style;
        props.onTouchTap = this.props.onClick;

        var self = this;
        return (React.createElement('div', {}, [React.createElement('icon', props)]));
    }

});

module.exports = HIcon;
