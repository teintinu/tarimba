module.exports = function (app) {
require('./appmenu.less');
  var estoria=require('../stores/appmenu');
  return {
    stories:{
      appmenu: estoria
    },
    render: function(){
    var itens_menu=estoria.getItensMenu()
      return (
         <div class="menu">
           <ul class="menu-list">
              itens_menu.map(function(item){
                <li>
                   item
                </li>

             });
           </ul>
         </div>
         );
    }
  }
}
