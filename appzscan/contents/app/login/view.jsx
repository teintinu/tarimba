module.exports = function (app) {

    var view = {
        stories: {
        },
        render: function () {
          return (
            <button onClick={this.onClick}>
              Login
            </button>
          );
        },
        onClick: function(){
          app.showcontent(require('../welcome/view.jsx'));
        }
    };

    return view;
};
