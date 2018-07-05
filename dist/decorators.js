'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.withStompedRabbit = withStompedRabbit;

var _StompedRabbit = require('./StompedRabbit');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _util = require('util');

var _co = require('co');

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
 * @param {Function|String} args.config.endpoint the rabbitMQ URI - eg 'ws://user:pass@myrabbit.com:15754' - when a string, the name of the class method to invoke.
 * 
 * @returns {} 
 */
function withStompedRabbit(args) {

	args = args || {};

	let { initialize, key, config, instance, onConnect } = args;

	//default initialize false (should be true...)
	initialize = initialize === undefined ? true : initialize;

	//default the instance to the default singleton
	instance = instance === undefined ? 'default' : instance;

	//default key to "db" @todo: make this "mg"
	key = key || 'mq';

	//check to ensure we have a config if we're initializing, or throw.
	if (initialize) {
		if (!config) return console.error('StompedRabbit refused to decorate. Either provide a config in the decorator arguments or set initialize false.');
		if (!config.endpoint) return console.error('Decorate configuration as `config:{endpoint:<rabbit url>}`');
	}

	return function (target) {
		let WrappedRabbit = class WrappedRabbit extends target {

			constructor(cargs) {

				super(cargs);

				let id = _crypto2.default.randomBytes(16).toString("hex");

				if (!RabbitInstances[instance] || !(RabbitInstances[instance].inst instanceof _StompedRabbit.StompedRabbit)) {

					RabbitInstances[instance] = {
						inst: new _StompedRabbit.StompedRabbit(args),
						ids: [id]
					};
				} else {

					RabbitInstances[instance].ids.push(id);
				}

				this[key] = RabbitInstances[instance].inst;

				if (initialize) this.decInitialize();

				if (onConnect) {

					let fn;
					if (typeof onConnect === 'function') fn = onConnect;else if (typeof this[onConnect] === 'function') fn = this[onConnect];else console.warn('Stomped-Rabbit::onConnect was neither a function or a class member method');

					if (fn) {
						(0, _co2.default)(function* () {
							yield fn();
						});
					}
				}
			}

			decInitialize() {
				var _this = this;

				return _asyncToGenerator(function* () {

					_this[key].configure(config);
					let connection = _this[key].connect();
				})();
			}

		};


		return WrappedRabbit;
	};
}