var flux = require('flux'),
    react = require('react');
window.React = react;

var AppZscanReact_onchange, AppZscanContentReact_onchange;
var AppZscanReact = react.createClass({
    getInitialState: function () {
        return {}
    },
    render: function () {
        var views = [];
        for (var viewfn in views_ativas)
            views.push(views_ativas[viewfn].render())
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
            return AppZscanContent.current_view.render();
        else
            return react.createElement('h1', {}, 'ERRO: FALTA CONTEÚDO');
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
    show: showview,
    hide: hideview,
    showcontent: function (modView: ModView) {
        if (AppZscanContent.current_view) {
            parar_de_usar_view(modView);
            delete AppZscanContent.current_view;
        }
        var v = usar_view(modView);
        AppZscanContent.current_view = v;
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

var
    views_ativas = {
        //viewfn: {render: function, component: class_react}
    };

type RenderFunction = () => void;
type ObjView = {
    stories: any;
    render: RenderFunction
};
type ModView = () => ObjView;

function showview(modView: ModView, params, callback) {
    var v = views_ativas[modView];
    if (!v) {
        v = views_ativas[modView] = criaview(modView);
    }
    //viewfn.setParams(params);
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
    return modView;
}

function hideview(modView: ModView, callback) {
    var v = views_ativas[modView];
    if (v) {
        for (var apelido_estoria in v.viewobj) {
            var estoria = modView[apelido_estoria];
            delete modView[apelido_estoria];
            parou_de_usar_estoria(estoria, ret.change_handler);
        }
        delete v.viewobj;
        delete views_ativas[modView];
    }
    if (AppZscanReact_onchange)
        AppZscanReact_onchange();
}

function usar_view(modView: ModView, params, callback) {
    var v = criaview(modView);
    //viewfn.setParams(params);
    return v;
}

function parar_de_usar_view(v, callback) {
    for (var apelido_estoria in v.viewobj) {
        var estoria = modView[apelido_estoria];
        delete modView[apelido_estoria];
        parou_de_usar_estoria(estoria, ret.change_handler);
    }
    delete v.viewobj;
}

function criaview(viewfn) {
    //if (view_.zapp_id)
    //    throw new Error('Tentativa de criar a mesma view mais de uma vez');
    var viewobj = viewfn(AppZscan);
    viewobj.zapp_id = zapp_gen_id++;
    var change_handler_react;

    var originalcomponentDidMount = viewobj.componentDidMount;
    var originalcomponentDidUnount = viewobj.componentDidUnount;
    viewobj.componentDidMount = function () {
        var self = this;
        change_handler_react = function () {
            self.setState({})
        };
        if (originalcomponentDidMount)
            originalcomponentDidMount();
    };
    viewobj.componentDidUnount = function () {
        change_handler_react = null;
        if (originalcomponentDidUnount)
            originalcomponentDidUnount();
    }

    var view_component = react.createClass(viewobj);
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
        viewobj[apelido_estoria] = estoria_mod;
    }
    return ret;
}

//- initializa aplicação

declare_actions(require('./actions/appzscan'))

AppZscan.show(require('./views/apptitle.jsx'));
AppZscan.show(require('./views/apptask_icone.jsx'));
AppZscan.show(require('./contents/app/login/view.jsx'));

react.render(AppZscan.element, document.getElementById("app"));

module.exports = AppZscan;
