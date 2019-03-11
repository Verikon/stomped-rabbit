'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = undefined;

var _StompedRabbit = require('./StompedRabbit');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Client = exports.Client = class Client {

    constructor(endpoint, options = {}) {

        if (endpoint) this.endpoint = endpoint;

        if (options.exchange) this.exchange = exchange;

        if (options.debug !== undefined) this.debug = options.debug;
    }

    connect() {
        var _this = this;

        return _asyncToGenerator(function* () {

            let result;

            const { endpoint, exchange } = _this;

            let config = {
                endpoint,
                exchange
            };

            _this.sr = new _StompedRabbit.StompedRabbit(config);
            _this.sr.configure(config);

            yield _this.sr.connect();
        })();
    }

    query() {

        return this.sr;
    }

};