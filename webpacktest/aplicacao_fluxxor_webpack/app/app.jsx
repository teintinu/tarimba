var React = require("react"),
    Fluxxor = require("fluxxor");

window.React = React;

var constants = {
  CALCULAR_JUROS: "CALCULAR_JUROS"
};

var Calculo_de_Juros = Fluxxor.createStore({
  initialize: function() {
    this.calculoId = 0;
    this.calculos = {};
    this.taxa_juros = 0.05;

    this.bindActions(
      constants.CALCULAR_JUROS, this.calcular
    );
  },

  calcular: function(dados) {
    var id = this._nextCalculoId();
    var calculo = {
      id: id,
      taxa: this.taxa_juros,
      tempo: dados.tempo,
      valor: dados.valor,
      montante: (dados.valor * Math.pow((1 + this.taxa_juros), dados.tempo/30))
    };
    this.calculos[id] = calculo;
    this.emit("change");
  },

  getState: function() {
    return {
      calculos: this.calculos
    };
  },

  _nextCalculoId: function() {
    return ++this.calculoId;
  }
});

var actions = {
  calcularjuros: function(valor, tempo) {
    this.dispatch(constants.CALCULAR_JUROS, {valor: valor, tempo: tempo});
  }
};

var calculos = {
  Calculo_de_Juros: new Calculo_de_Juros()
};

var flux = new Fluxxor.Flux(calculos, actions);

window.flux = flux;

flux.on("dispatch", function(valorx, tempox) {
  if (console && console.log) {
    console.log("[Dispatch]", valorx, tempox);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("Calculo_de_Juros")],

  getInitialState: function() {
    return { valor: 0, tempo: 0};
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("Calculo_de_Juros").getState();
  },

  render: function() {
    var calculos = this.state.calculos;
    return (
      <div>
        <ul>
          {Object.keys(calculos).map(function(id) {
            return <li key={id}><CalculoItem calculo={calculos[id]} /></li>;
          })}
        </ul>
        <form onSubmit={this.onSubmitForm}>
          <label> Valor emprestado
          <input type="number" size="30"
                 value={this.state.valor}
                 onChange={this.handleValor} />
                 </label>
                 <label> Quantidade de Dias
           <input type="number" size="30" placeholder="Digite a quantidade de dias"
                 value={this.state.tempo}
                 onChange={this.handleTempo} />
                 </label>
          <input type="submit" value="Calcular" />
        </form>
      </div>
    );
  },

  handleValor: function(e) {
    this.setState({valor: e.target.value});
  },
  handleTempo: function(e) {
    this.setState({tempo: e.target.value});
  },

  onSubmitForm: function(e) {
    e.preventDefault();
    var valor = parseInt(this.state.valor);
    var dias = parseInt(this.state.tempo);
    if (valor > 0 &&  dias> 0) {
      this.getFlux().actions.calcularjuros(valor, dias);
      this.setState({valor: 0, tempo: 0});
    }
  }
});

var CalculoItem = React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    calculo: React.PropTypes.object.isRequired
  },

  render: function() {
    var style = {
      textDecoration: this.props.calculo.complete ? "line-through" : ""
    };

    return (<span style={style}>
                taxa: {this.props.calculo.taxa},
               valor: {this.props.calculo.valor},
               Montante depois de {this.props.calculo.tempo} dias: {this.props.calculo.montante}
               </span>
            );
  }
});

React.render(<Application flux={flux} />, document.getElementById("app"));
