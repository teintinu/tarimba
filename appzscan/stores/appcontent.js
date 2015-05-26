module.exports = function () {
    var conteudo = 'bla bla bla';

    var estoria_conteudo = {
        getState: function () {
            return {
                conteudo: conteudo
            };
        },
        setTitle: function (payload) {
            conteudo = payload.conteudo;
        }
    };

    return estoria_conteudo;
};
