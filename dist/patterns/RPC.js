'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _PatternBase = require('./PatternBase');

var _PatternBase2 = _interopRequireDefault(_PatternBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let RPC = class RPC extends _PatternBase2.default {

	constructor(props) {

		super(props);
	}

	/**
  * Create an RPC listener.
  * 
  * If you're actually legit using this , please DM me as to how/why as i can't think of a single use case for this other than
  * to itch my completionism.
  * 
  */
	provision(queue, fn, options) {
		var _this = this;

		return _asyncToGenerator(function* () {

			//ensure we dont' already have a provision.
			if (_this.main.provisions[queue]) return { success: false, error: 'Queue `' + queue + '` already has a provision'

				//parse the options
			};options = _this.parseOptions(options);

			let prov = _this.stomp.subscribe(_this.toURL(queue, options), function () {
				var _ref = _asyncToGenerator(function* (frame) {

					let replyQueue;

					try {

						const { body, headers } = frame;

						let args, result;

						///to error handle or not to.
						replyQueue = headers['reply-to'];

						//decode the message to args.
						args = _this.decode(body);

						//invoke the listening function
						try {
							result = fn(args);
							if (result instanceof Promise) response = yield result;
							result = _this.encode(result);
						} catch (err) {

							result = _this.errorHandle(err);
						}

						//insert a way to deal with acceptable TTL.

						_this.stomp.send(replyQueue, {}, result);
					} catch (err) {

						_this.stomp.send('/queue/' + replyQueue, _this.errorHandle(err));
					}
				});

				return function (_x) {
					return _ref.apply(this, arguments);
				};
			}(), options.queue);

			_this.main.provisions[queue] = Object.assign(prov, { type: 'rpc' });

			return { success: true, provision: _this.main.provisions[queue] };
		})();
	}

	/**
  * Deprovision an endpoint.
  */
	deprovision(queue) {
		var _this2 = this;

		return _asyncToGenerator(function* () {

			_this2.main.provisions[queue].unsubscribe();
			delete _this2.main.provisions[queue];

			return { success: true };
		})();
	}

	/**
  * Invoke an RPC listener
  * 
  * @param {String} queue the queue/endpoint to the RPC listener.
  * @param {*} the message being sent as arguments to the listener.
  * @param {Object} an options object
  * 
  * @returns {Promise} resolves with the RPC response.
  */
	invoke(queue, message, options) {
		var _this3 = this;

		return new Promise(function (resolve, reject) {

			//parse the options.
			options = _this3.parseOptions(options);

			//encode the options.
			message = _this3.encode(message);

			//create a response queue and apply it to the options.
			let responseQueue = 'stomped-' + parseInt(Math.random() * 10000000, 10);
			options.queue['reply-to'] = responseQueue;

			//set up the listener on the response queue, autodeleting it (this is an exclusive use)
			_this3.stomp.subscribe(responseQueue, function (frame) {

				let response = _this3.decode(frame.body);
				_this3.stomp.unsubscribe(responseQueue);

				resolve(response);
			}, { id: responseQueue, 'exclusive': true });

			//fire off the rpc invocation.
			_this3.stomp.send(_this3.toURL(queue, options), options.queue, message);
		});
	}

};
exports.default = RPC;