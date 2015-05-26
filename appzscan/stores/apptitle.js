module.exports = function () {
    var titulo_da_aplicacao = 'Zscan';

    var estoria_apptitle = {
        getState: function () {
            return {
                title: titulo_da_aplicacao
            };
        },
        setTitle: function (payload) {
            titulo_da_aplicacao = payload.title;
        }
    }

    return estoria_apptitle;
}
