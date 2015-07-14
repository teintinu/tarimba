import FluxEasy from 'flux-easy';

class TempStore extends FluxEasy.Store {

    constructor() {
        this.state.itensList = [
            {id:"1", name: "Ramon"},
            {id:"4",name: "Minoru"},
            {id:"3",name: "Neto"},
            {id:"2", name: "Marcelo"}
        ];
    }

    novo(){
        return {
            id: null,
            name: ""
        }
    }

    editar(id){
        for(var i = 0; i < this.itensList.length; i++){
            if(this.itensList[i].id == id)
                return {id: this.itensList[i].id,
                        name: this.itensListComplexa[i].name
                };
        }
    }

    salvar(dados){
        try{
            this.itensList.concat([{
                id: dados.id,
                name: dados.name
            }]);
            this.emit('CADASTROU');
        }
        catch(e){
            this.emit('FALHOU');
        }
    }
}

export default TempStore;
