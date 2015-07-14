import FluxEasy from 'flux-easy';
import React from 'react';
import H from '../crud/libs/h5mobile/h5frontend.js';

window.hsession = {
    language: 'pt_br'
};
var mock_editing = {
    name: ''
};
var mock_editing_errors = {};
var mock_store = {
    getState() {
        return {
            editing: mock_editing,
            editing_errors: mock_editing_errors
        }
    }
}
var AppInput = React.createClass({
    render: function () {
        return (
            React.createElement(H.Input, {
                store: mock_store,
                floatingLabelText: "Nome",
                hintText: "Digite seu nome",
                field: 'name',
                className: 'hcol1'
            })
        )
    }
});

React.render( < AppInput / > , document.body);
