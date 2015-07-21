import FluxEasy from 'flux-easy';
import AppStore from './app.store.js';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

class AppView extends FluxEasy.View {

    constructor() {
        AppView.app = AppStore.createStoreReference(dispatcher);

        this.app.addEventListener('RefreshAll', this);
        this.app.addEventListener('RefreshTasks', this);
    }

    render() {
        return (<div></div>);
    }
}


export default AppView;
