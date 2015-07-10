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
           {itens_menu.map((item)=>
              <React.addons.TransitionGroup component="li" transitionName="aparecer">
                <a href="#">{item}</a>
              </React.addons.TransitionGroup>
           )}
           </ul>
         </div>
         );
    }
  }
}
