type Tarefa = {
    titulo: string
};

module.exports = {
    __constructor: constructor_apptask,
    // acoes
    executar_tarefa: function (titulo: string): void {},
    // getState
    temTarefasEmExecucao: function (): boolean {},
    lista_tarefas: function (): Array < Tarefa > {}
}


function constructor_apptask() {

    type Tarefa = {
        titulo: string
    };

    var todas_as_tarefas: Array < Tarefa > = [{
        titulo: 'xxx'
}];

    var acoes = {
        executar_tarefa: function executar_tarefa(titulo) {
            this.todas_as_tarefas.push({
                titulo: titulo
            });
        }
    };

    var getStateMethods = {
        lista_tarefas: function () {
            return todas_as_tarefas.map(function (t) {
                return {
                    titulo: t.titulo
                }
            });
        },
        temTarefasEmExecucao: function () {
            return todas_as_tarefas.length > 0
        }
    }

    return {
        actions: acoes,
        methods: getStateMethods
    };
}
