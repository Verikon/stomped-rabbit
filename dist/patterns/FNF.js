'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _PatternBase = require('./PatternBase');

var _PatternBase2 = _interopRequireDefault(_PatternBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let FNF = class FNF extends _PatternBase2.default {

	constructor(props) {

		super(props);
	}

	/**
  * Create a FNF listener
  */
	provision(queue, options) {
		var _this = this;

		return _asyncToGenerator(function* () {

			//parse the options
			options = _this.parseOptions(options);
		})();
	}

	deprovision() {
		return _asyncToGenerator(function* () {})();
	}

	/**
  * Invoke an FNF listener
  * 
  * @param {String} queue the queue/endpoint to the RPC listener.
  * @param {*} the message being sent as arguments to the listener.
  * @param {Object} an options object
  * 
  * @returns {Promise} resolves with the RPC response.
  */
	invoke(queue, message, options) {
		var _this2 = this;

		return _asyncToGenerator(function* () {

			//parse the options.
			options = _this2.parseOptions(options);

			//encode the options.
			message = _this2.encode(message);

			//create a response queue and apply it to the options.
			let responseQueue = 'stomped-' + parseInt(Math.random() * 100000, 10);
			options['reply-to'] = responseQueue;

			//set up the listener on the response queue, autodeleting it (this is an exclusive use)
			_this2.client.subscribe('/queue/' + responseQueue, function (frame) {

				let response = _this2.decode(frame.body);
				_this2.client.unsubscribe(responseQueue);

				resolve(response);
			}, { id: responseQueue, 'auto-delete': true });

			//fire off the rpc invocation.
			_this2.client.send('/queue/' + queue, options);
		})();
	}

};
exports.default = FNF;