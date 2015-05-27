var React = require('react'),
   Fluxxor = require('fluxxor');

var constantes_das_acoes = {
   EXECUTAR_TAREFA : "CONSTANTE_EXECUTAR_TAREFA"
};

/*
declare class Tarefa {
    titulo_da_tarefa: string;
}
*/

var Estoria_App_Task = Fluxxor.createStore({
initialize: function() {
        this.lista_de_tarefas = [{titulo_da_tarefa: "Tarefa 1"}]; //lista de de objetos Class Tarefa
        this.bindActions(
            constantes_das_acoes.EXECUTAR_TAREFA, this.ao_executar_tarefa
        )
    },
    ao_executar_tarefa: function (payload){
        var dados_da_tarefa = payload;
        this.lista_de_tarefas.push(dados_da_tarefa);
        this.emit("change");
    },
    getState: function(){
        return this.lista_de_tarefas;
    }
});

var acoes_app_task = {
    executar_tarefa: function (titulo_da_tarefa){
        var tarefa = {};//new Tarefa();
        tarefa.titulo_da_tarefa = titulo_da_tarefa;

        this.dispatch(constantes_das_acoes.EXECUTAR_TAREFA, tarefa);
    }
}

var NossaAplicacao = {
    App_Task_Estoria: new Estoria_App_Task()
};

var aplicacao_flux = new Fluxxor.Flux(NossaAplicacao, acoes_app_task);









//View
var AppTaskIcon = React.createClass({
    mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("App_Task_Estoria")],
    getInitialState: function(){
        return {};
    },
    getStateFromFlux: function(){
        var flux = this.getFlux();

        return flux.store("App_Task_Estoria").getState();
    },
    render: function(){
        var flux = this.getFlux();
        var lista_de_tarefas =  flux.store("App_Task_Estoria").getState();
      return <div>{lista_de_tarefas.length} tarefas</div>
    }
});


//View
var AppTaskLista = React.createClass({
    mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin("App_Task_Estoria")],
    getInitialState: function(){
        return {};
    },
    getStateFromFlux: function(){
        var flux = this.getFlux();

        return flux.store("App_Task_Estoria").getState();
    },
    render: function(){
        var flux = this.getFlux();
        var lista_de_tarefas =  flux.store("App_Task_Estoria").getState();
      return <div><ul>{lista_de_tarefas.map((tarefa)=>
           <li>{tarefa.titulo_da_tarefa}</li>
           )}</ul>
           <button onClick={this.adicionarTarefa}>Adicionar Tarefa</button>
           </div>
    },
    adicionarTarefa: function (){
        this.getFlux().actions.executar_tarefa("tarefa: "+ new Date().toString());
    }
});


React.render(<AppTaskIcon flux={aplicacao_flux} />, document.getElementById("icone"));
React.render(<AppTaskLista flux={aplicacao_flux} />, document.getElementById("lista"));
