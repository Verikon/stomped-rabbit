'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _PatternBase = require('./PatternBase');

var _PatternBase2 = _interopRequireDefault(_PatternBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let CTE = class CTE extends _PatternBase2.default {

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
	provision(queue, options) {
		return _asyncToGenerator(function* () {})();
	}

	deprovision() {
		return _asyncToGenerator(function* () {})();
	}

	/**
  * Invoke a CTE listener
  * 
  * @param {String} queue the queue/endpoint to the CTE listener.
  * @param {*} the message being sent as arguments to the listener.
  * @param {Object} an options object
  * 
  * @returns {Promise} resolves {true}
  */
	invoke(queue, message, options) {
		return _asyncToGenerator(function* () {})();
	}

};
exports.default = CTE;