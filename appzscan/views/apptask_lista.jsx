module.exports = function () {

    require('./apptask_icone.less');

    var estoria_apptask= require('../stores/apptask');

    var view = {
        stories: {
            estoria_apptask: estoria_apptask
        },
        render: function () {
            return <ul>
            {view.estoria_apptask.lista_tarefas().map(
              (tarefa)=>
                <li>
                   tarefa.titulo
                </li>
            )}
            < /ul>
        }
    };

    return view;
};
