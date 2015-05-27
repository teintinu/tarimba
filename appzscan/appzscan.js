var flux = require('flux'),
    react = require('react');
window.React = react;

var AppZscanReact_onchange, AppZscanContentReact_onchange;
var AppZscanReact = react.createClass({
    getInitialState: function () {
        return {}
    },
    render: function () {
        var views = pagelets_ativos.map((pagelet) => pagelet.__render());
        views.push(react.createElement(AppZscanContent));
        return react.createElement('div', {}, views);
    },
    componentDidMount: function () {
        var self = this;
        AppZscanReact_onchange = function () {
            self.setState({})
        };
    },

    componentWillUnmount: function () {
        AppZscanReact_onchange = null;
    },
});

var AppZscanContent = react.createClass({
    current_view: null,
    getInitialState: function () {
        return {}
    },
    render: function () {
        if (AppZscanContent.current_view != null)
            return react.createElement('div', {
                id: 'appcontent'
            }, AppZscanContent.current_view.__render());
        else
            return react.createElement('div', {
                id: 'appcontent'
            }, 'ERRO: FALTA CONTEÚDO');
    },
    componentDidMount: function () {
        var self = this;
        AppZscanContentReact_onchange = function () {
            self.setState({})
        };
    },

    componentWillUnmount: function () {
        AppZscanContentReact_onchange = null;
    },
});


var AppZscan = {
    element: react.createElement(AppZscanReact),
    dispatcher: new flux.Dispatcher(),
    show_pagelet: show_pagelet,
    hide_pagelet: hide_pagelet,
    showcontent: function (modView: ModView) {
        if (AppZscanContent.current_view) {
            parar_de_usar_view(modView);
            delete AppZscanContent.current_view;
        }
        usar_view(modView);
        AppZscanContent.current_view = modView;
        if (AppZscanContentReact_onchange)
            AppZscanContentReact_onchange();
    }
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

function cria_callback_para_acoes(objEstoria) {
    var fn = function (payload) {
        var fn = objEstoria[payload.actionType];
        if (fn && typeof fn === 'function') {
            fn.apply(this, payload.args);
            objEstoria.change_listeners.forEach(fn => fn());
        }
    };
    return fn;
}

function cria_dispatch_para_acao(actions, name) {
    var fn = function () {
        AppZscan.dispatcher.dispatch({
            actionType: name,
            args: arguments
        });
    };
    fn.meta = actions[name];
    fn.meta.zapp_id = zapp_gen_id++;
    actions[name] = fn;
    acoes_declaradas[name] = fn;
    return fn;
}

// ---- sobre STORES

function usar_estoria(modEstoria, change_handler) {
    if (!modEstoria.__instance) {
        if (modEstoria.zapp_id)
            throw new Error('Tentativa de registrar a mesma estória mais de uma vez');
        var objEstoria = modEstoria.__constructor();
        modEstoria.__instance = {
            contador_de_uso: 1,
            objEstoria: objEstoria
        };
        objEstoria.change_listeners = [];
        for (var propname in objEstoria.actions) {
            var prop = objEstoria.actions[propname];
            if (typeof prop !== 'function')
                throw new Error(propname + ' deveria ser uma função');
            usar_acao(propname);
            modEstoria[propname] = acoes_declaradas[propname];
        }
        for (var propname in objEstoria.methods) {
            var prop = objEstoria.methods[propname];
            if (typeof prop !== 'function')
                throw new Error(propname + ' deveria ser uma função');
            modEstoria[propname] = objEstoria.methods[propname];
        }
        modEstoria.__instance.dispathToken = AppZscan.dispatcher.register(cria_callback_para_acoes(modEstoria.__instance));
    } else
        modEstoria.__instance.contador_de_uso++;

    if (change_handler)
        modEstoria.__instance.objEstoria.change_listeners.push(change_handler);

    return modEstoria.__instance.objEstoria;
}

function parou_de_usar_estoria(modEstoria, change_handler) {
    if (modEstoria.__instance)
        if (modEstoria.__instance.contador_de_uso > 1)
            modEstoria.__instance.contador_de_uso--;
        else {
            AppZscan.dispatcher.unregister(modEstoria.__instance.dispathToken);
            var i = modEstoria.__instance.objEstoria.change_listeners.indexOf(change_handler);
            if (i >= 0)
                modEstoria.__instance.objEstoria.change_listeners.splice(i, 1);
            delete modEstoria.__instance.objEstoria;
            delete modEstoria.__instance;
        }
}

function usar_acao(nome) {
    if (!acoes_declaradas[nome])
        throw new Error('Não existe uma ação com o nome: ' + actionname);
}

// sobre VIEWS

type RenderFunction = () => void;
type ObjView = {
    stories: any;
    render: RenderFunction
};
type ModView = () => ObjView;

var
    pagelets_ativos: Array < ModView > = [];


function show_pagelet(modView: ModView, params, callback) {
    if (!modView.__instance)
        usar_view(modView);
    pagelets_ativos.push(modView);
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
}

function hide_pagelet(modView: ModView, callback): void {
    if (modView.__instance)
        parar_de_usar_view(modView);
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
}

function usar_view(modView: ModView, params, callback): void {
    if (modView.__instance)
        modView.__contador_de_uso++;
    else {
        criaview(modView);
        modView.__contador_de_uso = 1;
    }
    //viewfn.setParams(params);
}

function parar_de_usar_view(modView: ModView, callback): void {
    if (!modView.__instance)
        return;
    if (modView.__contador_de_uso > 1)
        modView.__contador_de_uso--;
    else {
        for (var apelido_estoria in modView.stories) {
            var estoria_link = modView[apelido_estoria];
            delete modView[apelido_estoria];
            parou_de_usar_estoria(estoria_link, modView.__change_handler);
        }
        delete modView.__instance;
        delete modView.__render;
        delete modView.__contador_de_uso;
        delete modView.__change_handler;
    }
}

function criaview(modView: ModView): void {
    modView.__instance = modView(AppZscan);
    cria_funcao_change_handler();
    var view_component = react.createClass(modView.__instance);
    modView.__render = function () {
        return react.createElement(view_component)
    };
    //viewobj.setParams = function () {};
    //viewobj.close = function () {
    //    AppZscan.hide(viewfn);
    //};
    for (var apelido_estoria in modView.__instance.stories) {
        var estoria_mod = modView.__instance.stories[apelido_estoria];
        var estoriaobj = usar_estoria(estoria_mod, modView.__changed_handler);
        var fn = function () {
            return estoriaobj.getState();
        }
        modView.__instance[apelido_estoria] = estoria_mod;
    }

    function cria_funcao_change_handler() {
        var change_handler_react;
        var originalcomponentDidMount = modView.__instance.componentDidMount;
        var originalcomponentDidUnount = modView.__instance.componentDidUnount;
        modView.__instance.componentDidMount = function () {
            var self = this;
            change_handler_react = function () {
                self.setState({})
            };
            if (originalcomponentDidMount)
                originalcomponentDidMount();
        };
        modView.__instance.componentDidUnount = function () {
            change_handler_react = null;
            if (originalcomponentDidUnount)
                originalcomponentDidUnount();
        };
        modView.__change_handler = function () {
            if (change_handler_react)
                change_handler_react();
        }
    }
}

//- initializa aplicação

declare_actions(require('./actions/appzscan'))

AppZscan.show_pagelet(require('./views/apptitle.jsx'));
AppZscan.show_pagelet(require('./views/apptask_icone.jsx'));
AppZscan.showcontent(require('./contents/app/login/view.jsx'));
AppZscan.show_pagelet(require('./views/appmenu.jsx'));

react.render(AppZscan.element, document.getElementById("app"));

module.exports = AppZscan;
