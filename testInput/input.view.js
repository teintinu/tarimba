import FluxEasy from 'flux-easy';
import React from 'react';
import H from '../crud/libs/h5mobile/h5frontend.js';

window.hsession = {
    language: 'pt_br'
};
var mock_editing = {
    name: ''
};
var mock_editing_errors = {
    name: 'required'
};
var mock_store = {
    getState() {
            return {
                editing: mock_editing,
                editing_errors: mock_editing_errors
            }
        },
        setState(value) {
            mock_editing.setState({
                name: value
            })
        }
}
var AppDiv = React.createClass({
    render: function () {
        return (
            React.createElement("div", {
                    id: 'wrap'
                },
                React.createElement("button", {
                    id: 'btn'
                }, 'Button'),
                React.createElement(H.Input, {
                    store: mock_store,
                    floatingLabelText: "Nome",
                    hintText: "Digite seu nome",
                    field: 'name',
                    className: 'hcol1'
                })
            )
        )
    }
});

React.render( < AppDiv / > , document.body);
