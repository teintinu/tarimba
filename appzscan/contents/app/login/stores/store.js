var transform_sha1 = require('../validateLogin/validateSHA_1');
var actionheroClient = require("actionhero-client");
var client = new actionheroClient();
client.defaults.host = "127.0.0.1";
client.defaults.port = "5000";



module.exports = {
    __constructor: constructor_apptask,
    setOnline: function (): void {},
    autentication: function (user: String, pass: String): Boolean {},
    whoOnline: function (): String {},
}


function constructor_apptask() {

    var who: string = "mar@";
    var online: boolean = false;

    var acoes = {
        setOnline: function setOnline(user) {
            online = true;
        },


        autentication: function (user, pass) {
            client.action('login', {
                    user: user,
                    password: pass
                },

                function (err, data) {
                    if (err)
                        return erro()
                    sucesso()
                });

            function sucesso() {
                acoes.setOnline();
                var app = require('../../../../appzscan');
                return app.showcontent(require('../../welcome/view.jsx'));
            }

            function erro() {
                var usuario = document.getElementsByName("username")[0];
                usuario.setAttribute("class", "erro");
                var senha = document.getElementsByName("password")[0];
                senha.setAttribute("class", "erro");
            }

        }

    };
    var getStateMethods = {
        whoOnline: function () {
            if (online) {
                return who;
            }
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}