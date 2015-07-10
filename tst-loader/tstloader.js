console.log('OK');

var escodegen = require('escodegen-jsx')
var loaderUtils = require('loader-utils');

module.exports = function (source, inputSourceMap) {
    debugger;
    this.cacheable && this.cacheable();

    var sourceFilename = loaderUtils.getRemainingRequest(this);
    var current = loaderUtils.getCurrentRequest(this);

    var ast = monta_programa(source);
    var gen = escodegen.generate(ast, {
        sourceMap: sourceFilename,
        sourceMapWithCode: true,
        comment: true
    });

    if (gen.map) {
        gen.map. version= 3;
        gen.map.sources = [sourceFilename];
        gen.map.file = current;
        gen.map.sourcesContent = [source];
        gen.map.mappings=gen.map._mappings;
        gen.map.names=gen.map._names;
        gen.map.skipValidation=gen.map._skipValidation;
    }

    this.callback(null, gen.code, gen.map);
}


function monta_programa(source) {
    var prg=new ASTMaker()
    prg.add('document.write("OK")');
    return ast;
}

function ASTMaker()
{
    this.type='Program';
    this.body=[];

    has_body(this);

    function has_body(obj){
        obj.add=function(line, col, js){

        }
    }
}
