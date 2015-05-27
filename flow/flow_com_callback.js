/* @flow */

function a(x, fn) {
    return fn(x * 2);
}

type fn_tipo = (x: number) => number;

function b(x, fn: fn_tipo) {
    return fn(x * 2);
}

var quadruplo_x = a(2, function (dobro) {
    return dobro * 2;
});

console.log(quadruplo_x);

var quadruplo_y = b(3, function (dobro) {
    return dobro * 2;
});

console.log(quadruplo_y);
