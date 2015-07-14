import FluxEasy from 'flux-easy';

class AppInput extends FluxEasy.Store {

    constructor() {
        this.state.name = '';
        this.state.editing = {};
        this.state.editing_errors = {};
    }
}
export default AppInput;
