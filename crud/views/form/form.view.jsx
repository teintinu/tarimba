import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import H from '../../libs/h5components/h5frontend.js';

class AppFormView extends FluxEasy.View {

    constructor() {
        AppFormView.app = AppStore.createStoreReference(dispatcher);
        this.state.target= this.props.target;
    }

    render() {
      return (
        <div>
        <H.Form labelText={{pt_br: "Conteudo do formulario 1", en: "Form content one", es: "Formular el contenido"}}>
            <H.Row>
              <H.Input hintText="hcol12" colspan="12" className="hcol12" floatingLabelText="hcol12" />
            </H.Row>
        </H.Form>
        <H.Floatingactionbutton icon="fa fa-bed" />
        <H.Action run={this.mudarIdioma} labelText={{pt_br:"Change Language", en: "Mudar lá linguagem", es: "Trocar Linguagem"}}/>
          <H.Action run={this.abrirForm2} labelText={{pt_br:"abrirForm2", en: "abrirForm2", es: "abrirForm2"}}/>
          </div>
      );
    }

    mudarIdioma(){
        this.app.setLanguage();
    }
    _onCheck(e, checked) {radi
        console.log('Checked: ', checked);
    }
    abrirForm2(){
        window.location.hash = "#Form2";
    }
}

export default AppFormView;
