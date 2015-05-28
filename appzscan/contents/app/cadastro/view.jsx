module.exports = function (app) {
    var appcadastro = require('../../../stores/appcadastro');
    var view = {
        stories: {
            estoriacadastro : appcadastro
        },
        render: function () {
            var obj = view.estoriacadastro.getCampos();
            var arr_itens = [];
            for (var campo in obj){
                arr_itens.push(<label>
                  {obj[campo].label}:<input type={obj[campo].type} />
                </label>
                )
            }
          return (
            <div>
              {arr_itens.map((item)=>
               <div className={item._store.props.children[0]}>{item}
              </div>
              )}
            </div>
          );
        }
    };
    return view;
};
