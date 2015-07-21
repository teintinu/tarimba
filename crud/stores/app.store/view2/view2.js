import FluxEasy from 'flux-easy';
var React = require('react');

class View2 extends FluxEasy.View {

    constructor() {
        View2.displayName = "View2";
    }

    render() {
      return (
        <div>
            View 2
          </div>
      );
    }
}

export default View2;
