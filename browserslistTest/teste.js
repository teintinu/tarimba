var browserslist = require('browserslist');


var browsers = browserslist('last 1 version, > 5%, Android >= 4');

console.log(JSON.stringify(browsers, null, 2));
