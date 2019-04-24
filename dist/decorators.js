"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StompedRabbit_1 = require("./StompedRabbit");
const co_1 = __importDefault(require("co"));
let RabbitInstances = {
    default: null
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
    let { initialize, key, config, instance, onConnect, onConnectError } = args;
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
        class WrappedRabbit extends target {
            constructor(cargs) {
                super(cargs);
                let id = parseInt((Math.random() * 10000).toString());
                if (!RabbitInstances[instance] || !(RabbitInstances[instance].inst instanceof StompedRabbit_1.StompedRabbit)) {
                    RabbitInstances[instance] = {
                        inst: new StompedRabbit_1.StompedRabbit(),
                        ids: [id]
                    };
                }
                else {
                    RabbitInstances[instance].ids.push(id);
                }
                this[key] = RabbitInstances[instance].inst;
                if (initialize) {
                    this.decInitialize({ onConnect, onConnectError });
                }
            }
            decInitialize({ onConnect, onConnectError }) {
                return __awaiter(this, void 0, void 0, function* () {
                    this[key].configure(config);
                    let connection = this[key].connect()
                        .then(res => {
                        if (onConnect) {
                            let fn;
                            if (typeof onConnect === 'function')
                                fn = onConnect;
                            else if (typeof this[onConnect] === 'function')
                                fn = this[onConnect].bind(this);
                            else
                                console.warn('Stomped-Rabbit::onConnect was neither a function or a class member method');
                            //were using the lightweight co package to account for the possibility of generators being argued.
                            if (fn) {
                                co_1.default(function* () { yield fn(); });
                            }
                        }
                    })
                        .catch((err) => __awaiter(this, void 0, void 0, function* () {
                        if (onConnectError) {
                            let fn;
                            if (typeof onConnectError === 'function')
                                fn = onConnectError;
                            else if (typeof this[onConnectError] === 'function')
                                fn = this[onConnectError];
                            else
                                console.warn('Stomped-Rabbit::onConnectError was neither a function or a class member method');
                            //were using the lightweight co package to account for the possibility of generators being argued.
                            if (fn) {
                                co_1.default(function* () { yield fn(err); });
                            }
                        }
                    }));
                });
            }
        }
        return WrappedRabbit;
    };
}
exports.withStompedRabbit = withStompedRabbit;
