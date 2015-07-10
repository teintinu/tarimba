var h5MixinProps = {
    getProps: function (props) {
        var propriedades;
        if (props)
            propriedades = props;
        else
            propriedades = this.props

        var props_button = {};

        for (var prop in propriedades) {
            if (/.+Text$/.test(prop)) {
                if (typeof propriedades[prop] === "object")
                    props_button[prop] = propriedades[prop][window.hsession.language];
                else
                    props_button[prop] = propriedades[prop];
            } else
                props_button[prop] = propriedades[prop];
        }

        return props_button;
    },
    getPropsArray: function (propComponent) {
        var self = this;
        var propsMap = propComponent.map(function (props) {
            return self.getProps(props);
        })

        return propsMap;
    }
};

module.exports = h5MixinProps;
