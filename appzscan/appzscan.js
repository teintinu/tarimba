var flux = require('flux');

var AppZscanReact = React.createClass({
    getInitialState: function () {
        return {
            views_ativas: {
                //name_view: {render: function, component: class_react}
            }
        };
    },
    render: function () {
        var views = [];
        var state = this.getState();
        for (var viewname in state.views_ativas)
            views.push(state.views_ativas[viewname].render())
        return React.createElement('div', {}, views);
    }
});

var AppZscan = {
    element: React.createElement('AppZscanReact'),
    dispatcher: new flux.Dispatcher(),
    show: showview,
    hide: hideview
};

AppZscan.show('./views/apptask_view_icone');

//var apptitle = require('stores/apptitle');
//var apptask = require('stores/apptask');
//var appcontent = require('stores/appcontent');

React.render(AppZscan.element, document.getElementById("app"));

var estorias_em_uso = {};

function usar_estoria(objestoria) {
    var estoria_em_uso = estorias_em_uso[objestoria];
    if (!estoria_em_uso) {
        estoria_em_uso = {
            contador_de_uso: 1
        };
        for (var propname in objestoria) {
            var prop = objestoria[propname];
            if (typeof prop === 'function')
                usar_acao(propname);
        }
        estoria_em_uso.dispathToken = AppZscan.dispatcher.register(cria_funcao_callback(estoria_em_uso));
        estorias_em_uso[objestoria] = estoria_em_uso;
    } else
        estoria_em_uso.contador_de_uso++;
}

function parou_de_usar_estoria(objestoria) {
    var estoria_em_uso = estorias_em_uso[objestoria];
    if (estoria_em_uso && estoria_em_uso.contador_de_uso <= 1) {
        AppZscan.dispatcher.unregister(estoria_em_uso.dispathToken);
        delete estorias_em_uso[objestoria];
    }
}

function usar_acao(nome) {
    if (!AppZscan.actions[actionname])
        throw new Error('Não existe uma ação com o nome: ' + actionname);
}

//usar_estoria(apptitle);
//usar_estoria(apptask);
//usar_estoria(appcontent);
module.exports = AppZscan;

declare_actions(require('actions/apptask.actions'))

function declare_actions(actions) {
    for (var actionname in actions) {

        var action = actions[actionname];
        if (AppZscan.actions[actionname])
            throw new Error('Já existe uma ação com o nome: ' + actionname);
        actions[actionname] = cria_funcao_dispatch(actionname);
    }
}

function cria_funcao_callback(estoria) {
    return function (payload) {
        var fn = objestoria[payload.actionType];
        if (fn && typeof fn === 'function') {
            fn.apply(this, payload.args);
            //            if (payload.element_react)
            //                payload.element_react.setState({});
            // change -> render
        }
    };
}

function cria_funcao_dispatch(actionname) {
    function () {
        AppZscan.dispatcher.dispatch({
            actionType: actionname,
            args: arguments
        });
    }
}

function showview(view, params) {
    var state = element.getState();
    var v = state.views_ativas[view];
    if (!v)
        v = state.views_ativas[view] = cria_view(view);
    view.setParams(params);
    return view;
}

function showview(view_path) {
    var view_obj = require(view_path + '.jsx');
    var view_name = '/(\w[\w,\d,_]*)$'.exec(view_path)[1];
    var ret = {
        render: function () {
            return React.createElement(view_name)
        },
        component: React.createComponent({
            render: view_obj.render
        })
    }

    return ret;
}
