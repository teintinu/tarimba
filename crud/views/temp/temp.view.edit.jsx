import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import TempStore from '../../stores/crud.store.js';

import H from '../../libs/h5components/h5frontend.js';

class TempViewEdit extends FluxEasy.View {

    constructor() {
        TempViewEdit.app = AppStore.createStoreReference(dispatcher);
        TempViewEdit.temp = TempStore.createStoreReference(dispatcher);
        this.state.dados ={};
        this.temp.addEventListener('SALVOU', this.sucess);
        this.temp.addEventListener('FALHOU', this.showDialogGravou);
    }


    render() {
        var editingId= this.props.routeParams;
        if(this.state.dados[editingId] == null) {
            if(editingId == 'add')
                this.state.dados[editingId] = this.temp.novo();
            else
                this.state.dados[editingId] = this.temp.editar(editingId);
        }
        return (
            <div>
                <input type='text' value={this.state.item[editingId].name} onChange={this.mudouName} />
                <H.Action label="Salvar" run={this.salvar} />
                <H.Action label="Cancelar" run={this.cancelar} />
            </div>
       );
    }


    salvar(){
       var dados = {
           id: this.state.dados[this.props.routeParams].id,
           name: this.state.dados[this.props.routeParams].name
       };
       this.temp.salvar(dados);
    }

    cancelar(){
       window.history.back();
    }

    mudouName(e){
       this.state.dados[this.props.routeParams].name = e.target.value;
       this.setState({});
    }

    sucess(){
       window.location.hash = window.location.hash+ '/#Temp';
    }
}

export default TempViewEdit;
