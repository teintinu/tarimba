module.exports = {
    __constructor: constructor_apptitle,
    getTitle: function getTitle(): string {},
    setTitle: function (title: string): void {}
}

function constructor_apptitle() {

    var titulo_da_aplicacao = 'Título Inicial';

    return {
        actions: {
            setTitle: function (title: string): void {
                titulo_da_aplicacao = title;
            }
        },
        methods: {
            getTitle: function (): string {
                return titulo_da_aplicacao;
            }
        }
    }
}
