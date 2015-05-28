var transform_sha1 = require('../validateLogin/validateSHA_1');

module.exports = {
    __constructor: constructor_apptask,
    setOnline: function (): void {},
    autentication: function (user: String, pass: String): Boolean {},
    whoOnline: function (): Boolean {},
}


function constructor_apptask() {

    var who: string = "marcello@";
    var online: boolean = false;

    var acoes = {
        setOnline: function setOnline(user) {
            this.online = true;
        },

        autentication: function (user, pass) {

            if (who == user && pass == "adm") {
                acoes.setOnline();
                var app = require('../../../../appzscan');
                return app.showcontent(require('../../welcome/view.jsx'));
            } else {
                var usuario = document.getElementsByName("username")[0];
                usuario.setAttribute("class", "erro");
                var senha = document.getElementsByName("password")[0];
                senha.setAttribute("class", "erro");
            }

        }

    };
    var getStateMethods = {
        whoOnline: function () {
            if(this.online)
                return true;
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}
