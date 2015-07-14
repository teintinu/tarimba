import FluxEasy from 'flux-easy';
import AppStore from '../../stores/app.store.js';
import TempStore from '../../stores/temp.store.js';
import mui from 'material-ui';
import H from '../../libs/h5components/h5frontend.js';

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var {TextField,
     RaisedButton,
     Snackbar,
     FlatButton,
     Dialog,
     Paper,
     FontIcon,
     Menu,
     ListDivider,
     MobileTearSheet,
     List,
     ListItem,
     Avatar,
     FloatingActionButton} = mui;


class TempView extends FluxEasy.View {

    constructor() {
        TempView.app = AppStore.createStoreReference(dispatcher);
        TempView.temp = TempStore.createStoreReference(dispatcher);
    }

    render() {
        return (
        <div>
            <H.List
                text={this.fnText}
                detail={this.fnDetail}
                actionEdit={this._editar}
                itensList={this.temp.getState().itensList}
                actionDelete={this._delete}>
            </H.List>
            <FloatingActionButton onTouchTap={this.cadastrar_funcionario} iconClassName="fa fa-plus" style={{position: 'fixed', right: '30px', bottom: '30px'}} />
        </div>

       );
    }

    cadastrar_funcionario() {
        window.location.hash = window.location.hash+ '/add';
    }

    fnText(item){
        return(
            item.name
        )
    }

    fnDetail(item){
        return(
            <div>{item.name}</div>
        )
    }

    componentComplexo(){
        return(
            <div>
                <H.Action label="Botão Teste" run={this._action} />
            </div>
        )
    }

    _editar(item){
        window.location.hash = window.location.hash+ '/' +item._id;
    }

    _delete(){
        alert("Deletar");
    }

}

export default TempView;
