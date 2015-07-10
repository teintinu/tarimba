exports.login = {
    name: 'login_action',
    description: 'login na aplicação',

    outputExample: {
        "id": "1",
        name: "Marcello"
    },

    inputs: {
        name: {
            required: true
        },
        password: {
            required: true
        },
    },
    run: function (api, data, next) {
        api.chatRoom.broadcast(data, "defaultRoom", "test", function () {});
        api.login_initializers.login_initializers_fn(data.params.name, data.params.password, function (err, res) {
            if (err) {
                return next(err);
            }
            data.response = {
                success: data.params.password == "123"
            };
            return next()
        })
    }
};
