module.exports = function (app) {
require('./appmenu.less');
  var estoria=require('../stores/appmenu');
  return {
    stories:{
      appmenu: estoria
    },
    render: function(){
    var itens_menu=estoria.getItensMenu();
      return (
         <div className="menu">
           <ul className="menu-list">
           {itens_menu.map((item)=> <li><a href="#">{item}</a></li>)}
           </ul>
         </div>
         );
    }
  }
}
