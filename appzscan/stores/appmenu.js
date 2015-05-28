module.exports = {
    __constructor: constructor_appmenu,
    getItensMenu: function getItensMenu(): Array<string> {},
    setItensMenu: function (itens: Array<string>): void {}
}

function constructor_appmenu() {

    var array_do_menu = ['Home','Servicos','Suporte', 'Documentos','Guia','Suporte','Suporte','Suporte','Suporte','Suporte','Suporte'];

    return {
        actions: {
            setItensMenu: function (itens: Array<string>): void {
                array_do_menu = itens;
            }
        },
        methods: {
            getItensMenu: function (): Array<string> {
                return array_do_menu;
            }
        }
    }
}
