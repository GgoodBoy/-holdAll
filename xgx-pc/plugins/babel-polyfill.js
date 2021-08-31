import 'babel-polyfill'
// const promiseFinally = require('promise.prototype.finally');// 向 Promise.prototype 增加 finally()
// promiseFinally.shim();

// Promise.prototype.finally = function (callback) {
//     let P = this.constructor;
//     return this.then(
//       value  => P.resolve(callback()).then(() => value),
//       reason => P.resolve(callback()).then(() => { throw reason })
//     );
// };
