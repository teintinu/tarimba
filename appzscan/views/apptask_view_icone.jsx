module.exports = function () {

  require('apptask.view.icone.less');

  var view_icone = {
    stories:{
      estoria_apptask: require('./stores/apptask')
    },
    render: function () {
        var lista_de_tarefas = this.estoria_apptask.getState();
        return <div className = {
            lista_de_tarefas.length == 0 ? 'atoa' : 'trabalhando'
        }> </div>
    }
  };

};
