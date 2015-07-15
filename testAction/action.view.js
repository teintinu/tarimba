import FluxEasy from 'flux-easy';
import React from 'react';
import H from '../crud/libs/h5mobile/h5frontend.js';

window.hsession = {
    language: 'pt_br'
};

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var mock_editing = {
    name: ''
};

var mock_save = ''

var mock_editing_errors = {};
var mock_store = {
    setState(valor) {
     this.mock_save = valor
    },
    getState() {
        var value_save = this.mock_save
        return {
            value_save
        }
    }
}


var AppAction = React.createClass({
    render: function () {
        return (
            <H.Action
                labelText= "Salvar"
                run= {this.salvar}
            />
        )
    },

salvar: function () {
        this.save('teste');
        alert(mock_store.getState());
},

save: function(valor){
    mock_store.setState(valor)
}

});



React.render( < AppAction / > , document.body);
