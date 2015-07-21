import FluxEasy from 'flux-easy';
window.hsession = {
    language: "pt_br"
};

class AppStore extends FluxEasy.Store {

    constructor() {
        this.state.login = null;
        this.state.apptitle = 'initializating...';
        this.state.openned_processes = {};
        this.state.curr_process = null;

        this.state.menuSelecionado = null;
        this.state.running = true;
        this.state.menuItems = [
            {
                name: "crud",
                module: require('bundle?lazy!./crud.store.js'),
                labelText: {
                    pt_br: 'CRUD - pt_br',
                    en: 'CRUD - en',
                    es: 'CRUD - es'
                }
            }
        ];
        this.state.notifications = [];
        this.state.session = null;

        window.addEventListener('hashchange', function () {
            this.setContent({
                hash: window.location.hash,
                keepSubRoute: false
            });
        }.bind(this));

        //window.addEventListener('popstate', function () {
        //    this.forward_step();
        //}.bind(this));

        window.addEventListener('resize', function () {
            this.emit('RefreshAll');
            this.emit('RefreshMenu');

        }.bind(this));

        setTimeout(function () {
            this.setContent('');
        }.bind(this), 50);
    }

    set setPesquisa(pesquisa) {
        this.state.curr_process.process.search(pesquisa);
    }

    setTitle(title) {
        this.state.apptitle = title;
        this.emit('RefreshTitle');
    }

    set setContent(hash) {

        var keepSubRoute;
        if (typeof hash === 'object') {
            keepSubRoute = hash.keepSubRoute;
            hash = hash.hash;
        }
        var processName = '',
            subroute = '',
            query = '',
            processInfo;

        var m = /#?([^\/\?]*)(?:\/([^\?]*))?(?:\?(.*))?/g.exec(hash);

        if (m) {
            processName = m[1];
            subroute = m[2];
            query = m[3];
            if (!processName && this.state.curr_process)
                processName = this.state.curr_process.processName;
            processInfo = this.state.openned_processes[processName];
            if (processInfo)
                if (keepSubRoute)
                    subroute = processInfo.subroute;
                else
                    processInfo.subroute = subroute;
        }
        hash = (processName ? '#' + processName : '') +
            (subroute ? '/' + subroute : '') +
            (query ? '?' + query : '');

        if (window.location.hash != hash)
            window.location.hash = hash;
        else {

            this.state.searchText = '';

            var hashWasChanged = (this.state.lasthash != hash);
            this.state.lasthash = hash;

            var er = hash.split('/');
            var processModule;
            var isWelcome = false;
            this.state.menuItems.forEach(function (menuItem) {
                if (menuItem.name == processName) {
                    processModule = menuItem.module;
                }
            });
            if (!processModule) {
//                processModule = require('bundle?lazy!./welcome.js');
                processModule = require('bundle?lazy!./crud.store.js');
                isWelcome = true;
            }
            var processInfo = this.state.openned_processes[processName];
            if (processInfo) {
                if (keepSubRoute)
                    subroute = processInfo.subroute;
                ativa_conteudo();
            } else
                var fn = processModule(function (mod) {
                    processInfo = {
                        reference: mod.createStoreReference(dispatcher),
                        subroute: subroute
                    };
                    if (!isWelcome)
                        this.state.openned_processes[processName] = processInfo;
                    ativa_conteudo();
                });

            function ativa_conteudo() {
                if (hashWasChanged)
                    processInfo.reference.route(subroute);
                this.state.curr_process = {
                    process: processInfo.reference,
                    processName: processName,
                    subroute: subroute,
                    task: processInfo.reference.getState().task
                };
                processInfo.subroute = subroute;
                this.emit('RefreshContent');
                if (this.state.curr_task != this.state.curr_process.task) {
                    this.state.curr_task = this.state.curr_process.task;
                    this.emit('RefreshTasks');
                }
            }
        }
    }

    get forward_step() {
        if (this.state.curr_process && this.state.curr_process.process && this.state.curr_process.process.forward_step)
            return this.state.curr_process.process.forward_step();
        return null;
    }

    get backContent() {
        window.history.back();
    }

    setLanguage() {
        if (window.hsession.language == "en")
            window.hsession.language = "es";
        else if (window.hsession.language == "es")
            window.hsession.language = "pt_br";
        else
            window.hsession.language = "en";
        this.emit('RefreshAll');
    }

    tasks() {
        var op = this.state.openned_processes;
        return Object.keys(op).reduce(function (ret, p) {
            var task = op[p].reference.getState().task;
            if (task != null)
                ret.push(task);
            return ret;
        }, []);
    }

    setClickItem(index) {
        this.state.menuSelecionado = index;
        this.emit('refreshMenu');
    }

//    activate_pagelet(view_of_pagelet_ref) {
//        this.state.pagelets.push(view_of_pagelet_ref);
//        this.emit('RefreshAll');
//    }
//
//    deactivate_pagelet(view_of_pagelet_ref) {
//        var i = this.state.pagelets.indexOf(view_of_pagelet_ref);
//        if (i >= 0) {
//            this.state.pagelets.splice(i, 1);
//            this.emit('RefreshAll');
//        }
//    }
}

export default AppStore;
