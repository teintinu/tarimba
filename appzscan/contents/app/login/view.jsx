module.exports = function (app) {
    var estorias_login = require("../login/stores/store");
    var view = {
        stories: {
            estorias_login: estorias_login
        },
        getInitialState: function()
        {
            return{
                username: '',
                password: ''
            }
        },
        handleChangeUser: function(event) {
            this.setState(
            {
                username: event.target.value
            }
            );
        },
        handleChangePass: function(event) {
            this.setState(
            {
                password: event.target.value
            }
            );
        },
        render: function () {
          return (
          <div>

                <input type="text" name="username" placeholder="Digite o usuário"
                         value={this.state.username} onChange={this.handleChangeUser} />
                <input type="password" name="password" placeholder="Digite a senha"
                        value={this.state.password} onChange={this.handleChangePass} />
                <button onClick={this.onClick}>Login</button>

            </div>
          );
        },
        onClick: function(){
            var user = this.state.username;
            var pass = this.state.password;
            view.stories.estorias_login.autentication(user, pass)

        }
    };

    return view;
};
