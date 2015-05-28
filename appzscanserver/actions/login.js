exports.login = {
    name: 'login',
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
        if (data.params.name == "1" && data.params.password == "1") {
            data.response.id = 1;
            data.response.name = "1";
            next(null);
        } else
            next("Usuário invalido");
    }
};
