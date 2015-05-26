var flux = require('flux');

var AppZscanReact = React.createClass({
    getInitialState: function () {
        return {
            views_ativas: [
                //name_view: {render: function, component: class_react}
            ]
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

declare_actions(require('./actions/apptask.actions'))

AppZscan.show(require('./views/apptask_view_icone'));

//var apptitle = require('stores/apptitle');
//var apptask = require('stores/apptask');
//var appcontent = require('stores/appcontent');

React.render(AppZscan.element, document.getElementById("app"));

module.exports = AppZscan;

var zapp_gen_id = 1;

// --------- SOBRE ACOES

function declare_actions(actions) {
    if (actions.zapp_id)
        throw new Error('Tentativa de registrar as mesmas ações mais de uma vez');
    for (var actionname in actions) {
        var action = actions[actionname];
        if (AppZscan.actions[actionname])
            throw new Error('Já existe uma ação com o nome: ' + actionname);
        cria_dispatch_para_acao(actions, actionname);
        actions.zapp_id = zapp_gen_id++;
    }
}

function cria_callback_para_acao(objEstoria) {
    return function (payload) {
        var fn = objEstoria[payload.actionType];
        if (fn && typeof fn === 'function') {
            fn.apply(this, payload.args);
            //            if (payload.element_react)
            //                payload.element_react.setState({});
            // change -> render
        }
    };
}

function cria_dispatch_para_acao(actions, name) {
    var fn = function () {
        AppZscan.dispatcher.dispatch({
            actionType: name,
            args: arguments
        });
    };
    fn.meta = actions[name]();
    fn.meta.zapp_id = zapp_gen_id++;
    actions[name] = fn;
    return fn;
}

// ---- sobre STORES

var estorias_em_uso = {};

function usar_estoria(modEstoria) {
    if (!estoria_em_uso) {
        if (modEstoria.zapp_id)
            throw new Error('Tentativa de registrar a mesma estória mais de uma vez');
        var objEstoria = modEstoria();
        estoria_em_uso = {
            contador_de_uso: 1,
            objEstoria: objEstoria
        };
        for (var propname in objEstoria) {
            var prop = objEstoria[propname];
            if (typeof prop === 'function')
                usar_acao(propname);
        }
        estoria_em_uso.dispathToken = AppZscan.dispatcher.register(cria_callback_para_acao(estoria_em_uso));
        estorias_em_uso[modEstoria] = estoria_em_uso;
        modEstoria.zapp_id = zapp_gen_id++;
    } else
        estoria_em_uso.contador_de_uso++;
    return estoria_em_uso.objEstoria;
}

function parou_de_usar_estoria(modEstoria) {
    var estoria_em_uso = estorias_em_uso[modEstoria];
    if (estoria_em_uso && estoria_em_uso.contador_de_uso <= 1) {
        AppZscan.dispatcher.unregister(estoria_em_uso.dispathToken);
        delete estoria_em_uso.objEstoria;
        delete estorias_em_uso[modEstoria];
    }
}

function usar_acao(nome) {
    if (!AppZscan.actions[actionname])
        throw new Error('Não existe uma ação com o nome: ' + actionname);
}

// sobre VIEWS

function showview(view, params, callback) {
    var state = element.getState();
    var v = state.views_ativas[view];
    if (!v)
        v = state.views_ativas[view] = cria_view(view);
    view.setParams(params);
    state.views_ativas.push(view);
    AppZscan.element.setState(state, callback);
    return view;
}

function criaview(view_path) {
    var view_obj = require(view_path + '.jsx');
    var view_name = '/(\w[\w,\d,_]*)$'.exec(view_path)[1];
    var ret = {
        render: function () {
            return React.createElement(view_name)
        },
        component: React.createComponent({
            render: view_obj.render
        })
    };
    for (var apelido_estoria in view_obj) {
        var estoria = view_obj[apelido_estoria];
        var fn = function () {
            return estoria.getState();
        }
        view_obj[apelido_estoria] = fn;
    }
    return ret;
}
