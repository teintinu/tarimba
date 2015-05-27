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
               return true
           else
               return false
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}
