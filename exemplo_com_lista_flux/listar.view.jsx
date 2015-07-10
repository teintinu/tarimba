import FluxEasy from 'flux-easy';

import Estoria from './listar.store.js';

class Visualizador extends FluxEasy.View {

    constructor() {
        this.estoria = Estoria.createStoreReference();
        this.estoria.addEventListener('ReexibeLista', this);
        this.filtro = "";
    }

    listar(){
        return this.estoria.filtrar(this.state.filtro);
    }

    render() {
        return (<div>

                <fieldset>

                <input type="text" valueLink={this.state.filtro}/>
                <ol>
                  <li>o usuario edita o input</li>
                  <li>o onChange do input tem um setState</li>
                  <li>o setState vai forçar a execução do render novamente</li>
                </ol>

                </fieldset>

                <fieldset>
                   <button onClick={this.incluir}>incluir</button>

                <ul>
                  <li>o usuario edita o input</li>
                  <li>o usuario clica no botao</li>
                  <li>no botao existe um dispatch da acao incluir, a partir daqui a view nao faz mais nada</li>
                  <li>na histria existe um callback que chama o metodo incluir</li>
                  <li>no método incluir é feito um push na lista de items</li>
                  <li>apos isso é emitido o evento ReexibeLista</li>
                  <li>quando um evento é emitido, todas as views que estão escutando o vento são avisadas</li>
                  <li>nesse exemplo, foi passado pro addEventListener o this, o que significa apenas renderizar a view novamente</li>
                </ul>

                </fieldset>

                <ul>
                  {
                    this.listar().
                      map( dado=>
                         <li> {dado.titulo} </li>
                    )
                  }
                </ul>


                </div>
               )
    }

    incluir(){
        this.estoria.incluir(this.state.filtro);
       // this.setState({filtro: ''});
    }

}

export default Visualizador;
