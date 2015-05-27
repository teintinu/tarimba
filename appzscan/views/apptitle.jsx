module.exports = function (app) {
  var estoria=require('../stores/apptitle');
  return {
    stories:{
      apptitle: estoria
    },
    render: function(){
    var s=estoria.getTitle()
      return (
         <h1>
           {s}
         </h1>
         );
    }
  }
}
