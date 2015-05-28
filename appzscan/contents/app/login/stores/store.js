var transform_sha1 = require('../validateLogin/validateSHA_1');

module.exports = {
    __constructor: constructor_apptask,
    setOnline: function (user: Object): void {},
    setOffline: function (user: Object): void {},
    autentication: function (user: String, pass: String): Boolean {},
    whoOnline: function (): Object {},
}


function constructor_apptask() {
    type Who = {
        user: string;
        username: string;
        password: string;
        permissions: string;
        online: boolean
    };

    var who: Array < Who > = [
        {
            user: "Fernando Tolentino",
            username: "fernando@",
            password: "42ef63e7836ef622d9185c1a456051edf16095cc",
            permissions: "master",
            online: false,
    },
        {
            user: "Marcello Victor",
            username: "marcello@",
            password: "42ef63e7836ef622d9185c1a456051edf16095cc",
            permissions: "master",
            online: false,
        }
    ];

    var acoes = {
        setOnline: function setOnline(user) {
            user.online = true;
        },
        setOffline: function setOffline(user) {
        },
         autentication: function (user, pass) {
            who.map(function (elem) {
                if (elem.username == user) {
                    transform_sha1(pass, function (err, res) {
                        if (!err)
                            if (res == elem.password) {
                                acoes.setOnline(elem); //elem.online = true;
                                var app = require('../../../../appzscan');
                                return app.showcontent(require('../../welcome/view.jsx'));
                            }
                    })
                    return
                } else {
                    var usuario = document.getElementsByName("username")[0];
                    usuario.setAttribute("class", "erro");
                    var senha = document.getElementsByName("password")[0];
                    senha.setAttribute("class", "erro");
                }
            })
        }

    };
    var getStateMethods = {

        whoOnline: function () {
            var ret = {};
            who.map(function (elem) {
                if (elem.online) {
                    ret = {
                        user: elem.user,
                        username: elem.username,
                        permissions: elem.permissions,
                        online: true,
                    }
                }
            })
            return (ret);
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}
