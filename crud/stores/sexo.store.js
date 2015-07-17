import FluxEasy from 'flux-easy';

class SexoStore extends FluxEasy.Store {

    constructor() {
        this.state.sexo = [
            {
                _id: '1',
                display: 'Feminino'
            }, {
                _id: '2',
                display: 'Masculino'
            }
        ];
    }

    find(_id, callback){
        callback(null, JSON.parse(JSON.stringify(this.state.sexo.filter((r)=> r._id == _id)))[0]);
    }

    querySexo(text, callback) {
        callback(null, this.state.sexo.filter((r)=> {
                text = text.toUpperCase();
                var display = r.display.toUpperCase();
                return display.indexOf(text) >= 0
            }
        ));

    }
}

export default SexoStore;
