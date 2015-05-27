module.exports = function (app) {

    require('./apptask_icone.less');
    //var app=require('./apptask_lista.jsx');
    var lista=require('./apptask_lista.jsx');

    var view = {
        stories: {
            estoria_apptask: require('../stores/apptask')
        },
        render: function () {
            var temTarefasEmExecucao = view.estoria_apptask.temTarefasEmExecucao();
            return <div className = {
                temTarefasEmExecucao ? 'atoa' : 'trabalhando'
                } onClick={this.onClick}>
                X
             < /div>
        },
        onClick: function(){
          app.show_pagelet(lista);
        }
    };

    return view;
};
