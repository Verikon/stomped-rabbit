"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var StompedRabbit_1 = require("./StompedRabbit");
var co_1 = require("co");
var RabbitInstances = {
    "default": null
};
/**
 * Decorate a class with an instance of StompedMongo
 *
 * @param {Object} args the argument object
 * @param {String} args.instance which instance to use, default : 'default'.
 * @param {String} args.key which attribute to decorate into the class: default 'mq' thus <yourclass>.mq accesses the StompedRabbit instance
 * @param {Boolean} args.initialize initialize upon construction, default true.
 * @param {Object} args.config a configuration object for the instance
 * @param {Function} args.onConnect a callback for when the instance connects
 * @param {Function} args.onConnectError a callback for when the instance fails to connect
 * @param {Function|String} args.config.endpoint the rabbitMQ URI - eg 'ws://user:pass@myrabbit.com:15754' - when a string, the name of the class method to invoke.
 *
 * @returns {}
 */
function withStompedRabbit(args) {
    args = args || {};
    var initialize = args.initialize, key = args.key, config = args.config, instance = args.instance, onConnect = args.onConnect, onConnectError = args.onConnectError;
    //default initialize false (should be true...)
    initialize = initialize === undefined ? true : initialize;
    //default the instance to the default singleton
    instance = instance === undefined ? 'default' : instance;
    //default key to "db" @todo: make this "mg"
    key = key || 'mq';
    //check to ensure we have a config if we're initializing, or throw.
    if (initialize) {
        if (!config)
            return console.error('StompedRabbit refused to decorate. Either provide a config in the decorator arguments or set initialize false.');
        if (!config.endpoint)
            return console.error('Decorate configuration as `config:{endpoint:<rabbit url>}`');
    }
    return function (target) {
        var WrappedRabbit = /** @class */ (function (_super) {
            __extends(WrappedRabbit, _super);
            function WrappedRabbit(cargs) {
                var _this = _super.call(this, cargs) || this;
                var id = parseInt((Math.random() * 10000).toString());
                if (!RabbitInstances[instance] || !(RabbitInstances[instance].inst instanceof StompedRabbit_1.StompedRabbit)) {
                    RabbitInstances[instance] = {
                        inst: new StompedRabbit_1.StompedRabbit(),
                        ids: [id]
                    };
                }
                else {
                    RabbitInstances[instance].ids.push(id);
                }
                _this[key] = RabbitInstances[instance].inst;
                if (initialize) {
                    _this.decInitialize({ onConnect: onConnect, onConnectError: onConnectError });
                }
                return _this;
            }
            WrappedRabbit.prototype.decInitialize = function (_a) {
                var onConnect = _a.onConnect, onConnectError = _a.onConnectError;
                return __awaiter(this, void 0, void 0, function () {
                    var connection;
                    var _this = this;
                    return __generator(this, function (_b) {
                        this[key].configure(config);
                        connection = this[key].connect()
                            .then(function (res) {
                            if (onConnect) {
                                var fn_1;
                                if (typeof onConnect === 'function')
                                    fn_1 = onConnect;
                                else if (typeof _this[onConnect] === 'function')
                                    fn_1 = _this[onConnect].bind(_this);
                                else
                                    console.warn('Stomped-Rabbit::onConnect was neither a function or a class member method');
                                //were using the lightweight co package to account for the possibility of generators being argued.
                                if (fn_1) {
                                    co_1["default"](function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, fn_1()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    }); });
                                }
                            }
                        })["catch"](function (err) { return __awaiter(_this, void 0, void 0, function () {
                            var fn_2;
                            return __generator(this, function (_a) {
                                if (onConnectError) {
                                    if (typeof onConnectError === 'function')
                                        fn_2 = onConnectError;
                                    else if (typeof this[onConnectError] === 'function')
                                        fn_2 = this[onConnectError];
                                    else
                                        console.warn('Stomped-Rabbit::onConnectError was neither a function or a class member method');
                                    //were using the lightweight co package to account for the possibility of generators being argued.
                                    if (fn_2) {
                                        co_1["default"](function () { return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, fn_2(err)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        }); });
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                    });
                });
            };
            return WrappedRabbit;
        }(target));
        return WrappedRabbit;
    };
}
exports.withStompedRabbit = withStompedRabbit;
