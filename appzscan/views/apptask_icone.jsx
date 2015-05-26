module.exports = function () {

require('./apptask_icone.less');

  var view= {
    stories:{
      estoria_apptask: require('../stores/apptask')
    },
    render: function () {
        var lista_de_tarefas = view.estoria_apptask();
        return <div className = {
            lista_de_tarefas.length == 0 ? 'atoa' : 'trabalhando'
            }> {lista_de_tarefas.length} </div>
    }
  };

  return view;
};
