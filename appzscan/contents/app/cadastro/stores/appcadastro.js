type Dados = {
    nome: string;
    endereco: string;
    sexo: string;
    datanascimento: string;
    telefone: string
};

module.exports = {
    __constructor: constructor_appcadastro,
    gravarCliente: function gravarCliente(dados):void {},
    gCliente: function gCliente(dados){}
}

function constructor_appcadastro() {
    var dados = {};
    return {
        actions: {
            gravarCliente: function(dados):void{
                this.gCliente(dados);
            }
        },
        methods: {
            gCliente: function(dados):void{
                console.log(dados);
            }
        }
    }
}
