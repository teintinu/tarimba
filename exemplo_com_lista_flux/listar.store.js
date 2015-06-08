import FluxEasy from 'flux-easy';

type Dado={
  id: number;
    titulo: sltring;
}


class EstoriaDaLista extends FluxEasy.Store {

    //items: Array<Dado>;

    constructor() {
        this.items = [
            {id: 1, titulo: 'um'},
            {id: 2, titulo: 'dois'},
        ];
    }

    filtrar(texto){
      if (texto=='')
        return this.items;
      var x=this.items;
      return x.
        reduce( (res, item) => {
          if (item.titulo.indexOf(texto)>=0)
            res.push(item);
          return res;
      }, [])
    }

    incluir(titulo){
       var x=this.items;
       this.items = x.concat([{id: 0, titulo: titulo}]);
       this.emit('ReexibeLista');
    }
}

export default EstoriaDaLista;
