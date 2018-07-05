'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _PatternBase = require('./PatternBase');

var _PatternBase2 = _interopRequireDefault(_PatternBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let PubSub = class PubSub extends _PatternBase2.default {

	constructor(props) {

		super(props);
	}

	/**
  * @param {String} queue the name of the queue
  * @param {Function} fn the listener function for this subscription
  * @param {Object} options the options object
  * 
  * @see PatternBase::parseOptions();
  */
	subscribe(queue, fn, options) {
		var _this = this;

		return _asyncToGenerator(function* () {

			//ensure we dont' already have a provision.
			if (_this.main.provisions[queue]) return { success: false, error: 'Queue `' + queue + '` already has a provision'

				//parse the options
			};options = _this.parseOptions(options);

			let prov = _this.stomp.subscribe(_this.toURL(queue, options), function () {
				var _ref = _asyncToGenerator(function* (frame) {

					try {

						const { body, headers } = frame;
						let args, result;

						args = _this.decode(body);

						fn(args);
					} catch (err) {

						result = _this.errorHandle(err);
					}
				});

				return function (_x) {
					return _ref.apply(this, arguments);
				};
			}(), options.queue);

			_this.main.provisions[queue] = Object.assign(prov, { type: 'pubsub' });

			return { success: true, provision: _this.main.provisions[queue] };
		})();
	}

	unsubscribe(queue) {
		var _this2 = this;

		return _asyncToGenerator(function* () {

			_this2.main.provisions[queue].unsubscribe();
			delete _this2.main.provisions[queue];

			return { success: true };
		})();
	}

	publish(queue, message, options) {
		var _this3 = this;

		return _asyncToGenerator(function* () {

			//parse the options.
			options = _this3.parseOptions(options);

			//encode the options.
			message = _this3.encode(message);

			//fire off the rpc invocation.
			_this3.stomp.send(_this3.toURL(queue, options), options, message);
		})();
	}

};
exports.default = PubSub;