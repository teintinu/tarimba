module.exports = function (app) {
    require('./view.less');
    var appcadastro = require('./stores/appcadastro');
    var view = {
        stories: {
            estoriacadastro : appcadastro
        },
        getInitialState: function()
        {
            return{
                nome: '',
                endereco: '',
                sexo:'Masculino',
                datanascimento:'',
                telefone:''
            }
        },
        handleChangeNome: function(event) {
            this.setState({nome: event.target.value});
        },
        handleChangeEndereco: function(event) {
            this.setState({endereco: event.target.value});
        },
        handleChangeSexo: function(event) {
            this.setState({sexo: event.target.value});
        },
        handleChangeDatanascimento: function(event) {
            this.setState({datanascimento: event.target.value});
        },
        handleChangeTelefone: function(event) {
            this.setState({telefone: event.target.value});
        },
        render: function () {
          return (
            <div className="geral">
               <label>Nome:
                <input type="text" key="nome" name="nome" value={this.state.nome} onChange={this.handleChangeNome}/></label>
               <label>Endereço:
                <input type="text" key="endereco" name="endereco" value={this.state.endereco} onChange={this.handleChangeEndereco}/></label>
               <label>Sexo:
                <select key="sexo" name="sexo" value={this.state.sexo} onChange={this.handleChangeSexo}>
                 <option>Masculino</option>
                 <option>Feminino</option>
                </select></label>
               <label>Data Nascimento:
                <input type="date" key="data-nascimento" name="datanascimento" value={this.state.datanascimento} onChange={this.handleChangeDatanascimento}/></label>
               <label>Telefone:
                <input type="tel" key="telefone" name="telefone" value={this.state.telefone} onChange={this.handleChangeTelefone}/></label>
               <button onClick={this.onClick} className="btn-gravar">Gravar</button>
            </div>
          );
        },
        onClick: function(){
          var dados = {
            nome: this.state.nome,
            endereco: this.state.endereco,
            sexo: this.state.sexo,
            datanascimento: this.state.datanascimento,
            telefone: this.state.telefone
          };
          view.estoriacadastro.gravarCliente(dados);
        }
    };
    return view;
};
