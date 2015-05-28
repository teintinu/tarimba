module.exports = {
    loadPriority: 1000,
    startPriority: 1000,
    stopPriority: 1000,
    initialize: function (api, next) {
        api.login_initializers = {
            name: "autenticacao initialize",
            global: true,
            login_initializers_fn: function (name, password, next) {
                if (name == 1 && password == 1)
                    return next();
                next("Usuário inexistente!")

            }

        };

        var authenticationMiddleware = {
            name: 'authentication Middleware',
            global: true,
            create: function (data, next) {
                api.log("Create", "info");
                for (var n in data)
                    if (typeof data[n] != "function")
                        api.log(" for " + n + " = " + JSON.stringify(data[n]), "info");
                api.log(JSON.stringify(data.params), "info");

                next();
                //                if (data.actionTemplate.authenticated === true) {
                //                    api.users.authenticate(data.params.userName, data.params.password, function (error, match) {
                //                        if (match === true) {
                //                            next();
                //                        } else {
                //                            error = new Error("Authentication Failed.  userName and password required");
                //                            next(error);
                //                        }
                //                    });
                //                } else {
                //                    next();
                //                }
            }
        };

        api.connections.addMiddleware(authenticationMiddleware);

        next();
    },
    start: function (api, next) {
        api.log("Ao conectar", "info");
        next();
    },
    stop: function (api, next) {
        next();
    }
};

//module.exports = {
//    loadPriority: 1000,
//    startPriority: 1000,
//    stopPriority: 1000,
//    initialize: function (api, next) {
//        api.login_initializers = {
//            name: "autenticacao initialize",
//            global: true,
//            login_initializers_fn: function (name, password, next) {
//                if (name == 1 && password == 1)
//                    return next();
//                next("Usuário inexistente!")
//
//            }
//
//        };
//
//        var authenticationMiddleware = {
//            name: 'authentication Middleware',
//            global: true,
//            preProcessor: function (data, next) {
//
//
//                next();
//                //                if (data.actionTemplate.authenticated === true) {
//                //                    api.users.authenticate(data.params.userName, data.params.password, function (error, match) {
//                //                        if (match === true) {
//                //                            next();
//                //                        } else {
//                //                            error = new Error("Authentication Failed.  userName and password required");
//                //                            next(error);
//                //                        }
//                //                    });
//                //                } else {
//                //                    next();
//                //                }
//            }
//        };
//
//        for (var n in api.connections)
//            api.log(" for " + n, "info");
//        api.connections.addCreateCallback(function (connection) {
//            api.log(connection.params.name, "info");
//        });
//
//        next();
//    },
//    start: function (api, next) {
//        api.log("Ao conectar", "info");
//        next();
//    },
//    stop: function (api, next) {
//        next();
//    }
//};
