var transform_sha1 = require('../validateLogin/validateSHA_1');
module.exports = {
    __constructor: constructor_apptask,
//action
    //logIn: function (user: String): void {},
//methods
    autentication: function (user: String, pass: String): Boolean {},
    whoOnline: function(): Object {},
}


function constructor_apptask() {
    type Who = {
        user: String;
        username: String;
        permissions: String;
        online: Boolean
    };

    var who: Array <Who> = [{
        user: null,                     //"Fernando",
        username: null,                 //"fernando@zscan.com",
        permissions: null,              //"master",
        online: false,                  //true
    }];

    var acoes = {
//        getState: function getState(user) {}
    };

    var passConfirm = "42ef63e7836ef622d9185c1a456051edf16095cc";
    var getStateMethods = {
        autentication: function (user, pass, callback) {
            transform_sha1(pass, function (err, res) {
                if (!err)
                    if (res == passConfirm)
                        callback(null, true)
            })
        },
        whoOnline: function(){
            who.map(function(elem){
                if(elem.online)
                    return(elem)
            })
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };

}
