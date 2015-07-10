import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import CRUDStore from '../../stores/crud.store.js';
import mui from 'material-ui';

import H from '../../libs/h5mobile/h5frontend.js';


class AppCRUD extends FluxEasy.View {

    constructor() {
        AppCRUD.app = AppStore.createStoreReference(dispatcher);
        AppCRUD.CRUD = CRUDStore.createStoreReference(dispatcher);
    }
    render() {
        return ( < div >
           <mui.Paper zDepth={1} style={{marginBottom: "78px"}}>
               <H.List text={this.fnText}
                   detail={this.fnDetail}
                   actionEdit = {this._editar}
                   itensList = {this.CRUD.getState().listing}
                   actionDelete = {this._delete} >
               < /H.List>
           </mui.Paper>
           <H.Floatingactionbutton style={{zIndex: '12'}}
               iconClassName="fa fa-bed"
               onClick={this.add}/>
        < /div >
        );
    }

    tirarFoto(item) {
        alert(item.name + " Foto");
    }

    fnText(item) {
        return (
            item.name
        )
    }

    fnDetail(item) {
        var ret = null;
        if(item.sexo == "F")
            ret = 'feminino';
        else
            ret = "masculino";
        return (
            'Gênero: ' + ret
        )
    }

    componentComplexo() {
        return ( < div >
            < H.Action label = "Botão Teste"
            run = {
                this._action
            }
            /> < /div >
        )
    }

    add() {
        this.CRUD.add();
    }

    _editar(item) {
        this.CRUD.edit(item._id, item.name);
    }

    _delete(item) {
        alert("Deletar");
    }
}

export default AppCRUD;
