var flux = require('flux'),
    react = require('react');
window.React = react;

var AppZscanReact_onchange;
var AppZscanReact = react.createClass({
    getInitialState: function () {
        return {}
    },
    render: function () {
        var views = [];
        for (var viewfn in views_ativas)
            views.push(views_ativas[viewfn].render())
        return react.createElement('div', {}, views);
    },
    componentDidMount: function () {
        AppZscanReact_onchange = this._onChange;
    },

    componentWillUnmount: function () {
        this._onChange = null;
    },
});

var AppZscan = {
    element: react.createElement(AppZscanReact),
    dispatcher: new flux.Dispatcher(),
    show: showview,
    hide: hideview
};

var zapp_gen_id = 1;

// --------- SOBRE ACOES

var acoes_declaradas = {};

function declare_actions(actions) {
    if (actions.zapp_id)
        throw new Error('Tentativa de registrar as mesmas ações mais de uma vez');
    for (var actionname in actions) {
        var action = actions[actionname];
        if (acoes_declaradas[actionname])
            throw new Error('Já existe uma ação com o nome: ' + actionname);
        cria_dispatch_para_acao(actions, actionname);
    }
    actions.zapp_id = zapp_gen_id++;
}

function cria_callback_para_acao(objEstoria) {
    return function (payload) {
        var fn = objEstoria[payload.actionType];
        if (fn && typeof fn === 'function') {
            fn.apply(this, payload.args);
            objEstoria.change_listeners.forEach(fn => fn());
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
    fn.meta = actions[name].meta;
    fn.meta.zapp_id = zapp_gen_id++;
    actions[name] = fn;
    acoes_declaradas[name] = fn;
    return fn;
}

// ---- sobre STORES

var estorias_em_uso = {};

function usar_estoria(modEstoria, change_handler) {
    var estoria_em_uso = estorias_em_uso[modEstoria];
    if (!estoria_em_uso) {
        if (modEstoria.zapp_id)
            throw new Error('Tentativa de registrar a mesma estória mais de uma vez');
        var objEstoria = modEstoria();
        estoria_em_uso = {
            contador_de_uso: 1,
            objEstoria: objEstoria
        };
        objEstoria.change_listeners = [];
        for (var propname in objEstoria) {
            if (propname != 'getState') {
                var prop = objEstoria[propname];
                if (typeof prop === 'function')
                    usar_acao(propname);
            }
        }
        estoria_em_uso.dispathToken = AppZscan.dispatcher.register(cria_callback_para_acao(estoria_em_uso));
        estorias_em_uso[modEstoria] = estoria_em_uso;
        modEstoria.zapp_id = zapp_gen_id++;
    } else
        estoria_em_uso.contador_de_uso++;

    if (change_handler)
        estoria_em_uso.objEstoria.change_listeners.push(change_handler);

    return estoria_em_uso.objEstoria;
}

function parou_de_usar_estoria(modEstoria, change_handler) {
    var estoria_em_uso = estorias_em_uso[modEstoria];
    if (estoria_em_uso && estoria_em_uso.contador_de_uso <= 1) {
        AppZscan.dispatcher.unregister(estoria_em_uso.dispathToken);
        var i = estoria_em_uso.objEstoria.change_listeners.indexOf(change_handler);
        if (i >= 0)
            estoria_em_uso.objEstoria.change_listeners.splice(i, 1);
        delete estoria_em_uso.objEstoria;
        delete estorias_em_uso[modEstoria];
    }
}

function usar_acao(nome) {
    if (!acoes_declaradas[nome])
        throw new Error('Não existe uma ação com o nome: ' + actionname);
}

// sobre VIEWS

var
    views_ativas = {
        //viewfn: {render: function, component: class_react}
    };

function showview(viewfn, params, callback) {
    var v = views_ativas[viewfn];
    if (!v)
        v = views_ativas[viewfn] = criaview(viewfn);
    //viewfn.setParams(params);
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
    return viewfn;
}

function hideview(viewfn, callback) {
    var v = views_ativas[viewfn];
    if (v) {
        for (var apelido_estoria in v.viewobj) {
            var estoria = viewfn[apelido_estoria];
            delete viewfn[apelido_estoria];
            parou_de_usar_estoria(estoria, ret.change_handler);
        }
        delete v.viewobj;
        delete views_ativas[viewfn];
    }
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
}

function criaview(viewfn) {
    //if (view_.zapp_id)
    //    throw new Error('Tentativa de criar a mesma view mais de uma vez');
    var viewobj = viewfn();
    viewobj.zapp_id = zapp_gen_id++;
    var change_handler_react;
    var view_component = react.createClass({
        getInitialState: viewobj.getInitialState,
        render: viewobj.render,
        componentDidMount: function () {
            change_handler_react = this._onChange;
            if (viewobj.componentDidMount)
                viewobj.componentDidMount();
        },
        componentWillMount: viewobj.componentWillMount,
        componentDidUnount: function () {
            change_handler_react = null;
            if (viewobj.componentDidUnount)
                viewobj.componentDidUnount();
        },
        componentWillUnmount: viewobj.componentWillUnmount
    });
    var ret = {
        viewobj: viewobj,
        render: function () {
            return react.createElement(view_component)
        },
        change_handler: function () {
            if (change_handler_react)
                change_handler_react();
        }
    };
    viewobj.setParams = function () {};
    viewobj.close = function () {
        AppZscan.hide(viewfn);
    };
    for (var apelido_estoria in viewobj.stories) {
        var estoria_mod = viewobj.stories[apelido_estoria];
        var estoriaobj = usar_estoria(estoria_mod, ret.view_changed_handler);
        var fn = function () {
            return estoriaobj.getState();
        }
        viewobj[apelido_estoria] = fn;
    }
    views_ativas[viewfn] = ret;
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
    return ret;
}

//- initializa aplicação

declare_actions(require('./actions/apptask'))

AppZscan.show(require('./views/apptask_icone.jsx'));

//var apptitle = require('stores/apptitle');
//var apptask = require('stores/apptask');
//var appcontent = require('stores/appcontent');

react.render(AppZscan.element, document.getElementById("app"));

module.exports = AppZscan;
