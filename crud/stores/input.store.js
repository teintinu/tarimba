import FluxEasy from 'flux-easy';
import V from './validations';

function DB() {
    var db = [
        {
            _id: 1,
            name: "Ana",
            doc: '123',
            mae: null,
            sexo: 'F'
        }
        ];

    this.find = function (id, callback) {
        var dado = db.reduce(function (ret, item) {
            if (!ret && item._id == id)
                return item;
            return ret;
        }, null);
        if (dado.mae)
            dado={
                _id: dado._id,
                name: dado.name,
                doc: dado.doc,
                sexo: dado.sexo,
               mae : {
                  _id: dado.mae,
                  display: db.reduce(function (ret, item) {
                      if (!ret && item._id == dado.mae)
                          return item.name+' '+item.doc;
                      return ret;
                  }, null)
               }
            };
        callback(null, dado);
    };

    this.search = function (searchText, callback) {
        callback(null, db.reduce(function (ret, item) {
            var itemName = item.name.toUpperCase();
            var searchTextaux = searchText.toUpperCase();
            if (searchText === '' || itemName.indexOf(searchTextaux) >= 0 || item._id == searchText) {
                ret.push({
                    _id: item._id,
                    name: item.name,
                    sexo: item.sexo
                });
            }
            return ret;
        }, []));
    }

    this.save = function (listing, editing, callback) {
        setTimeout(function () {
            if (editing._id) {
                for (var i = 0; i < db.length; i++)
                    if (db[i]._id == editing._id) {
                        db[i].name = editing.name;
                        db[i].doc = editing.doc;
                        db[i].mae = editing.mae._id
                    }
                for (var i = 0; i < listing.length; i++)
                    if (listing[i]._id == editing._id) {
                        listing[i].name = editing.name;
                    }
            } else {
                editing._id = db.reduce(function (maior, d) {
                    if (d._id > maior)
                        return d._id;
                    else
                        return maior;
                }, 0) + 1;
                db.push(editing);
                listing.push({
                    _id: editing._id,
                    name: editing.name
                });
            }
            callback(null);
        }, 400);
    }
}

var postgres = new DB();


var steps = {
    edita: require('bundle?lazy!../views/input/input.view.jsx')
};


class InputStore extends FluxEasy.Store {

    constructor() {
        this.state.step = steps.lista;

        this.state.listing = [];

        setTimeout(function () {
            this.search('');
        }.bind(this), 1);
    }

    set route(subroute) {
        // excluir pra frente ou pra tras
        if (!subroute) {
            this.state.step = steps.lista;
        } else if (subroute == 'add') {
            this.state.step = steps.edita;
        } else {
            this.state.step = steps.edita;
        }
    }

    get forward_step() {
        return null;
    }

    set task(task) {
        this.state.task = task;
        ZscanApp.emit("RefreshTasks");
    }

    search(text) {
        this.task({
            titleText: {
                pt_br: "Pesquisando"
            }
        });

        postgres.search(text, function (err, resp) {
            this.state.listing = resp;
            this.emit("RefreshList");
            this.task();
            if(this.state.step == steps.lista)
                zscanapp.setContent("#input");

        }.bind(this));
    }

}

export default InputStore;
