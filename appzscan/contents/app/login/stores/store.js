var transform_sha1 = require('../validateLogin/validateSHA_1');
//var ac = require("../../../../actionheroclient");
//var primus = require("../../../../../node_modules/primus/primus.js");
//
//
Primus('http://localhost:9090');

var client = new ActionheroClient({
    host: "127.0.0.1",
    port: "5000",
    url: "http://127.0.0.1:9090"
});

//var client = new ac("http://127.0.0.1:9090/api/login_action", {
//    params: {
//        id: 1
//    }
//});
client.action("login_action", {
        name: 1,
        password: 123
    }, function (err, res) {
        if (res.success == true)
            alert("action executada");
    })
    //client.connect(function (err, details) {
    //    client.roomAdd("defaultRoom");
    //    alert("HAAAA!!")
    //});


client.on('connected', function () {
    console.log('você está conectado no chat!')
});
client.on('disconnected', function () {
    console.log('você está disconectado do chat!')
})
client.on('error', function (err) {
    console.log('error', err.stack)
});



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
            actionclient.roomAdd("defaultRoom", function () {
                console.log("sucesso");
            });


            //            client.action('login_action', {
            //                    name: user,
            //                    password: pass
            //                },
            //                function (err, data) {
            //                    if (err)
            //                        return erro()
            //                    sucesso()
            //                });
            //            client.login_action(user, pass);

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
