import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';


/*

como um conteúdo é renderizado: https://bramp.github.io/js-sequence-diagrams/

on hash->App: setContent
App->process: createStoreReference
App->process: route
process->process: step,task
App->App: RefreshContent
App->Content: refresh(step/view,task)
Content->view: releaseViewReference(old)
Content->view: createViewReference
Content->view: render()

*/


class ContentView extends FluxEasy.View {

    constructor() {
        ContentView.app = AppStore.createStoreReference(dispatcher);
        this.app.addEventListener('RefreshContent', this.refresh);
        this.app.addEventListener('RefreshTasks', this.refresh);
        this.state.view_ref = null;
    }

    refresh() {
        var self = this;
        var proc = this.app.getState().curr_process;
        var procState = proc.process.getState();
        if (this.state.view_lazy != procState.step) {
            if (this.state.view_ref) {
                this.state.view_ref.releaseViewReference();
                this.state.view_ref = null;
            }
            procState.step(function (mod) {
                self.setState({
                    view_lazy: procState.step,
                    view_ref: mod.createViewReference(dispatcher),
                    task: procState.task
                });
            });
        } else self.setState({
            task: procState.task
        });
    }

    render() {
        if (!this.state.view_ref)
            return React.createElement('div', {}, 'NADA PARA EXIBIR');
        var className = this.state.task ? 'contentBusy' : 'content'
        return React.createElement('div', {
                className: className
            },
            React.createElement(this.state.view_ref.Class)
        );
    }
}

export default ContentView;
