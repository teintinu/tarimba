import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import CRUDStore from '../../stores/crud.store.js';

import H from '../../libs/h5mobile/h5frontend.js';
//import V from '../../libs/h5components/validacoes.js';


class AppCRUD extends FluxEasy.View {

    constructor() {

        AppCRUD.app = AppStore.createStoreReference(dispatcher);
        AppCRUD.CRUD = CRUDStore.createStoreReference(dispatcher);
        this.state.errorTextName = this.CRUD.getState().errorTextName;
        this.state.errorDocument = this.CRUD.getState().errorDocument;
        this.CRUD.addEventListener('Error', this.error);
    }

    render() {

        return ( < div >
            <H.Form labelText = {{pt_br: "CRUD"}} >
               <H.Row>
                  <H.Input store={this.CRUD}
                      floatingLabelText="Nome"
                      hintText = "Digite seu nome"
                      field = 'name'
                      className = 'hcol3' />
                  <H.Input store={this.CRUD}
                      floatingLabelText="Doc"
                      hintText="Digite seu documento"
                      field='doc'
                      className='hcol3' />
                  <H.Lookup store={this.CRUD}
                      floatingLabelText = "Mãe"
                      hintText = "Selecione a mãe"
                      field = 'mae'
                      className = 'hcol3'
                      notFoundText='Nenhuma mãe foi encontrada'
                      query = 'queryMaes'
                      lookup = {this.CRUD}/>
                  <H.Lookup store={this.CRUD}
                      floatingLabelText = "Pai"
                      hintText = "Selecione o Pai"
                      field = 'pai'
                      className = 'hcol3'
                      query = 'queryPais'
                      notFoundText='Nenhum pai foi encontrado'
                      lookup = {this.CRUD}/>
               </H.Row>
                <H.Row>
                  <H.Lookup store={this.CRUD}
                      floatingLabelText = "Default"
                      hintText = "Selecione valor default"
                      field = 'default'
                      className = 'hcol6'
                      query = 'queryMaes'
                      lookup = {this.CRUD}/>
                  <H.Select className="hcol6"
                  menuItems={[{_id: 1, display: 'Feminino'}, {_id: 2, display: 'Masculino'}]}
                         hintText="Sexo"
                         floatingLabelText="Sexo"
                         field="sexo"
                         store={this.CRUD} />
               </H.Row>
            </H.Form>
            <H.Action labelText="Salvar"
                run = {this.salvar}/>
            <H.Action labelText="Cancelar"
            run = {this.cancelar}/>
            </div>

        );
    }


    salvar(){
      this.CRUD.save();
    }

    error(){
      this.setState({});
      var errors = Object.keys(this.CRUD.getState().editing_errors);
      if (errors.length)
         return document.getElementsByName(errors[0])[0].focus();
    }

    cancelar() {
        zscanapp.backContent();
    }

    _editar(item) {
        alert("Editar" + item.name);
    }

    _delete() {
        alert("Deletar");
    }
}

export default AppCRUD;
