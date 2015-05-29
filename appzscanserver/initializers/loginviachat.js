        module.exports = {
            loadPriority: 1000,
            startPriority: 1000,
            stopPriority: 1000,
            initialize: function (api, next) {

                var connectionMiddleware = {
                    middleware: {},
                    globalMiddleware: [],

                    allowedVerbs: [
                'quit',
                'exit',
                'documentation',
                'paramAdd',
                'paramDelete',
                'paramView',
                'paramsView',
                'paramsDelete',
                'roomAdd',
                'roomLeave',
                'roomView',
                'detailsView',
                'say'
              ],
                    name: 'connection middleware',
                    priority: 1000,
                    create: function (connection) {
                        debugger;
                        api.log("usuário conectado:  " + connection.id, "info");
                        api.log("params  " + connection.params.id, "info");
//                        api.chatRoom.addMember(connection.id, "defaultRoom", function (err, wasAdd) {
            //                            if (err)
            //                                api.log("Você não foi conectado a sala", "err");
            //
            //                            connection.sendMessage(connection, "Teste de mensagem")
            //
            //                        })
                    },
                    destroy: function (connection) {
                        // do stuff
                    }
                };

                api.connections.addMiddleware(connectionMiddleware);
                //        var chathappa5 = {
                //            name: 'Chat Happa5',
                //            priority: 1000,
                //            join: function (connection, room, callback) {
                //                api.chatRoom.broadcast({}, room, 'Eu entrei na sala happa5: ' + connection.id, function (e) {
                //                    callback();
                //                });
                //            },
                //            leave: function (connection, room, callback) {
                //                // announce all connections leaving a room
                //                api.chatRoom.broadcast({}, room, 'Eu sai da sala happa5: ' + connection.id, function (e) {
                //                    callback();
                //                });
                //            },
                //            say: function (connection, room, messagePayload, callback) {
                //                api.log(messagePayload);
                //                callback();
                //            }
                //        };
                //
                //        api.chatRoom.addMiddleware(chathappa5);

                var chatCadastro = {
                    name: 'Chat cadastro',
                    priority: 1000,
                    join: function (connection, room, callback) {
                        api.chatRoom.broadcast({}, room, 'Eu entrei na sala de login: ' + connection.id, function (e) {
                            callback();
                        });
                    },
                    leave: function (connection, room, callback) {
                        // announce all connections leaving a room
                        api.chatRoom.broadcast({}, room, 'Eu sai da sala de login: ' + connection.id, function (e) {
                            callback();
                        });
                    },
                    say: function (connection, room, messagePayload, callback) {
                        api.log(messagePayload);
                        callback();
                    }
                };

                api.chatRoom.addMiddleware(chatCadastro);

                next();
            },
            start: function (api, next) {
                next();
            },
            stop: function (api, next) {
                next();
            }
        };
