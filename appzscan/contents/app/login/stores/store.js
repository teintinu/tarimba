module.exports = {
    __constructor: constructor_apptask,
    //action
//    logIn: function(): void{},
    //methods
    autentication: function(user: String, pass: String): Boolean{}
}


function constructor_apptask() {
var acoes = {
//        logIn: function executar_tarefa(){}
    };

    var getStateMethods = {
        autentication: function (user, pass) {
           if(user == "ola" && pass == "ola")
               window.alert("Acertou, miserávi")
//                app.showcontent(require('../welcome/view.jsx'));
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}
