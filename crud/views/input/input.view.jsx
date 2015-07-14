import FluxEasy from 'flux-easy';
import InputStore from '../../stores/input.store.js';
import H from '../../libs/h5mobile/h5frontend.js';


class AppInput extends FluxEasy.View {

  constructor() {
    AppInput.app = InputStore.createStoreReference(dispatcher);
  }
    render() {

        return ( < div >
            <H.Form labelText = {{pt_br: "Campo Input"}} >
               <H.Row>
                  <H.Input store={this.CRUD}
                      floatingLabelText="Nome"
                      hintText = "Digite seu nome"
                      field = 'name'
                      className = 'hcol1' />
               </H.Row>
            </H.Form>
            <H.Action labelText="OK"
                run = {this.onClick}/>
            </div>

        );
    }

  onClick(){
    alert("OK");
/*    app.editar(this.state.name);*/
  }
}

export default AppInput;
