import FluxEasy from 'flux-easy';
var React = require('react');

class Welcome extends FluxEasy.View {

    constructor() {
        Welcome.displayName = "Welcome";
    }

    render() {
      return (
        <div>
            Welcome
          </div>
      );
    }
}

export default Welcome;
