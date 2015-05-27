module.exports = function () {

    require('./apptask_icone.less');

    var view = {
        stories: {
            app_store: require('../stores/app')
        },
        render: function () {
            var views=[];
            var lista_de_views_abertas = view.app_store.lista_de_views_abertas();

            for (var modView in lista_de_views_abertas)
              views.push(lista_de_views_abertas[modView].render());

            return react.createElement('div', {}, views);
        }
    };

    return view;
};
