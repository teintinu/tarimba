var Router = require('./src/router.js');

var requireTest = require.context('./src/', true, /.*\.js$/);

function mostra_modulo(nome) {


    Router.navigate(nome);
    //var mod = requireTest(nome + '.js');
    //document.getElementById('content').innerHTML = mod;

    //    var reqfn = requireTest[nome];
    //    reqfn(function (mod) {
    //        document.getElementById('content').innerHTML = mod;
    //})

    //    require('./src/' + nome + ".js", function (mod) {
    //        document.getElementById('content').innerHTML = mod;
    //})
}

//
//window.addEventListener('hashchange', function () {
//    var nome = window.location.hash.substr(1);
//    mostra_modulo('./' + nome);
//})


// configuration
Router.config({
    root: '',
    mode: 'history'
});

// returning the user to the initial state
Router.navigate();

// adding routes
Router
    .add(/(.*)\/(.*)/, function (view_name, id) {
        console.log('products', view_name);
    })
    .add(function () {
        console.log('default');
    });
//.check('/products/12/edit/22').listen();

// forwarding
//Router.navigate('/about');

window.mostra_modulo = mostra_modulo;
