import FluxEasy from 'flux-easy';

class Store2 extends FluxEasy.Store {

    constructor() {
        this.state.step = require('bundle?lazy!./view2.js');
    }

    set route(subroute) {

    }

}

export default Store2;
