type Dados = {
    nome: string;
    endereco: string;
    sexo: string;
    datanascimento: string;
    telefone: string
};

module.exports = {
    __constructor: constructor_appcadastro,
    gravarCliente: function gravarCliente(dados):void {}
}

function constructor_appcadastro() {
    return {
        actions: {
            gravarCliente: function(dados: Dados):void{
                alert(JSON.stringify(dados));
            }
        },
        methods: {
        }
    }
}
