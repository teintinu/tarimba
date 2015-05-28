module.exports = function (app) {

    var view = {
        stories: {
        },
        render: function () {
          return (
            <div>
                <h2 >
                    Bem vindo
                </h2>
                <button onClick={this.onClick}>
                    cadastrar
                </button>
            </div>
          );
        },
        onClick: function(){
          app.showcontent(require('../cadastro/view.jsx'));
        }
    };

    return view;
};
