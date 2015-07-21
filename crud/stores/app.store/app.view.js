import FluxEasy from 'flux-easy';
import AppStore from './app.store.js';

var React = require('react');
var Flux = require('flux');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class AppView extends FluxEasy.View {

    constructor() {
        AppView.app = AppStore.createStoreReference(dispatcher);

        this.app.addEventListener('RefreshAll', this);
        this.app.addEventListener('RefreshContent', this.conteudo);
        this.app.addEventListener('RefreshTasks', this);
    }

    conteudo (){
        var proc = this.app.getState().curr_process;
        var procState = proc.process.getState();
        procState.step(function(mod){
            this.setState({view_ref: mod.createViewReference(dispatcher)});
        }.bind(this));
    }

    render() {

            if (!this.state.view_ref)
                return React.createElement('div', {}, 'NADA PARA EXIBIR');
            return (
                React.createElement('div', {}, [
                    React.createElement('div', {}, [React.createElement('h1', {}, [this.app.getState().apptitle])]),
                    React.createElement('div', {style: {backgroundColor: 'lightgray'}},
                    React.createElement(this.state.view_ref.Class))
                ])
            );
    }
}

var dispatcher = new Flux.Dispatcher();

var view = AppView.createViewReference(dispatcher);

React.render(React.createElement(view.Class), document.getElementById('app'));
