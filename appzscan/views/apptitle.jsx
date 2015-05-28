
module.exports = function (app) {
require('./apptitle.less');
  var estoria=require('../stores/apptitle');
  return {
    stories:{
      apptitle: estoria
    },
    render: function(){
    var s=estoria.getTitle()
      return (
             <h1 className="title">
               {s}
             </h1>

         );
    }
  }
}
