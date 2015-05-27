module.exports = {
    __constructor: constructor_appcadastro,
    getCampos : function getCampos() {}
}

function constructor_appcadastro() {

    var campos = {
        nome: {
            label: "Nome",
            type: "text"
        },
        telefone:{
            label:"Telefone",
            type: "tel"
        },
        endereco:{
            label:"Endereço",
            type: "text"
        },
        sexo:{
            label:"Sexo",
            type: "text"
        },
        dataNascimento:{
            label:"Data Nascimento",
            type: "date"
        }
    };
    return {
        actions: {
        },
        methods: {
            getCampos: function(){
                return campos;
            }
        }
    }
}
