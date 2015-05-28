module.exports = {
    __constructor: constructor_appmenu,
    getItensMenu: function getItensMenu(): array {},
    setItensMenu: function (itens: array): void {}
}

function constructor_appmenu() {

    var array_do_menu = ['Home','Serviços','Suporte'];

    return {
        actions: {
            setItensMenu: function (itens: array): void {
                array_do_menu = itens;
            }
        },
        methods: {
            getItensMenu: function (): array {
                return array_do_menu;
            }
        }
    }
}
