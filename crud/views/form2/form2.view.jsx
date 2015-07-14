import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import H from '../../libs/h5components/h5frontend.js';


class AppFormView extends FluxEasy.View {

    constructor() {
        AppFormView.app = AppStore.createStoreReference(dispatcher);

    }

    render() {
        return (
             <H.Form labelText={{pt_br: "Conteudo do formulario 2", en: "Form content one", es: "Formular el contenido"}}>
                    <H.Row>
                      <H.Input hintText="hcol12" colspan="2" className="hcol12" floatingLabelText="hcol12" />
                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol10" className="hcol10" floatingLabelText="hcol10" />

                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol10" className="hcol10" floatingLabelText="hcol10" />
                      <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol9" className="hcol9" floatingLabelText="hcol9" />
                      <H.Input hintText="hcol3" className="hcol3" floatingLabelText="hcol3" />
                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol8" className="hcol8" floatingLabelText="hcol8" />
                      <H.Input hintText="hcol4" className="hcol4" floatingLabelText="hcol4" />
                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol7" className="hcol7" floatingLabelText="hcol7" />
                      <H.Input hintText="hcol5" className="hcol5" floatingLabelText="hcol5" />
                    </H.Row>


                    <H.Row>
                      <H.Input hintText="hcol6" className="hcol6" floatingLabelText="hcol6" />
                      <H.Input hintText="hcol6" className="hcol6" floatingLabelText="hcol6" />
                    </H.Row>

                    <H.Row>
                      <H.Input hintText="hcol5" className="hcol5" floatingLabelText="hcol5" />
                      <H.Input hintText="hcol5" className="hcol5" floatingLabelText="hcol5" />
                      <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                    </H.Row>

                    <H.Row>
                       <H.Input hintText="hcol4" className="hcol4" floatingLabelText="hcol4" />
                       <H.Input hintText="hcol4" className="hcol4" floatingLabelText="hcol4" />
                       <H.Input hintText="hcol4" className="hcol4" floatingLabelText="hcol4" />
                    </H.Row>

                    <H.Row>
                       <H.Input hintText="hcol3" className="hcol3" floatingLabelText="hcol3" />
                       <H.Input hintText="hcol3" className="hcol3" floatingLabelText="hcol3" />
                       <H.Input hintText="hcol3" className="hcol3" floatingLabelText="hcol3" />
                       <H.Input hintText="hcol3" className="hcol3" floatingLabelText="hcol3" />
                    </H.Row>

                    <H.Row>
                       <H.Input hintText="hcol2" rowSpan="2" className="hcol2" floatingLabelText="hcol2" />
                       <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                       <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                       <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                       <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                       <H.Input hintText="hcol2" className="hcol2" floatingLabelText="hcol2" />
                    </H.Row>

                    <H.Row>
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                       <H.Input hintText="hcol1" className="hcol1" floatingLabelText="hcol1" />
                    </H.Row>
             </H.Form>);
    }
}

export default AppFormView;

/*<H.Select className="hcol2" menuItems={this.app.getState().DropdownEx} />*/
