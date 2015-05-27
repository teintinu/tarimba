var appzscan = require('./appzscan');

type Store = {};
type Render = function (): void;
type View = {
    store: Array < Store > ,
    render: Render
};

var lista_de_views_abertas /*: Array < View >*/ = [];

module.exports = {
    __constructor: constructor_app,
    // acoes
    abrir_view: function (modview): void {},
    fechar_view: function (modview): void {},
    // getState
    views_abertas: function () {}
}


function constructor_app() {

    var acoes = {
        abrir_view: appzscan.show,
        fechar_view: appzscan.hide,
        views_abertas: function () {
            return lista_de_views_abertas;
        }
    };

    return {
        actions: acoes,
        methods: {}
    };
}
