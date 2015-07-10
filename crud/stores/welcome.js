import FluxEasy from 'flux-easy';

class WelcomeStore extends FluxEasy.Store {

    constructor() {
        this.state.step = require('bundle?lazy!../views/welcome.html');
    }

    set route(subroute) {

    }

}

export default WelcomeStore;
