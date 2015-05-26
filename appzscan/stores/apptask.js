module.exports = function () {

    var lista_de_tarefas = ['tarefa 1', 'tarefa 2'];

    var estoria_apptask = {
        getState: function () {
            return lista_de_tarefas;
        },
        executar_tarefa: function (tarefa) {
            this.lista_de_tarefas.push(tarefa);
        }
    };

    return estoria_apptask;
}
