var escodegen = require('escodegen-jsx')
var loaderUtils = require('loader-utils');

module.exports = function (source, inputSourceMap) {
    this.cacheable && this.cacheable();

    var sourceFilename = loaderUtils.getRemainingRequest(this);
    var current = loaderUtils.getCurrentRequest(this);

    var ast = monta_programa(source);
    var gen = escodegen.generate(ast, {
        sourceMap: sourceFilename,
        sourceMapWithCode: true,
        comment: true
    });

    if (gen.sourceMap) {
        gen.sourceMap.sources = [sourceFilename];
        gen.sourceMap.file = current;
        gen.sourceMap.sourcesContent = [source];
    }

    this.callback(null, gen.code, gen.sourceMap);
}


function monta_programa(source) {
    var ast = {
        "range": [
        34,
        53
    ],
        "loc": {
            "start": {
                "line": 2,
                "column": 0
            },
            "end": {
                "line": 2,
                "column": 19
            }
        },
        "type": "Program",
        "body": [
            {
                "range": [
                34,
                53
            ],
                "loc": {
                    "start": {
                        "line": 2,
                        "column": 0
                    },
                    "end": {
                        "line": 2,
                        "column": 19
                    }
                },
                "type": "VariableDeclaration",
                "declarations": [
                    {
                        "range": [
                        38,
                        52
                    ],
                        "loc": {
                            "start": {
                                "line": 2,
                                "column": 4
                            },
                            "end": {
                                "line": 2,
                                "column": 18
                            }
                        },
                        "type": "VariableDeclarator",
                        "id": {
                            "range": [
                            38,
                            44
                        ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 4
                                },
                                "end": {
                                    "line": 2,
                                    "column": 10
                                }
                            },
                            "type": "Identifier",
                            "name": "answer"
                        },
                        "init": {
                            "range": [
                            47,
                            52
                        ],
                            "loc": {
                                "start": {
                                    "line": 2,
                                    "column": 13
                                },
                                "end": {
                                    "line": 2,
                                    "column": 18
                                }
                            },
                            "type": "BinaryExpression",
                            "operator": "*",
                            "left": {
                                "range": [
                                47,
                                48
                            ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 13
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 14
                                    }
                                },
                                "type": "Literal",
                                "value": 6,
                                "raw": "6"
                            },
                            "right": {
                                "range": [
                                51,
                                52
                            ],
                                "loc": {
                                    "start": {
                                        "line": 2,
                                        "column": 17
                                    },
                                    "end": {
                                        "line": 2,
                                        "column": 18
                                    }
                                },
                                "type": "Literal",
                                "value": 7,
                                "raw": "7"
                            }
                        }
                }
            ],
                "kind": "var"
        }
    ]
    };
    return ast;
}
