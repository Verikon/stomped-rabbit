'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
let PatternBase = class PatternBase {

	constructor(props) {}

	parseOptions(options) {

		options = options || {};

		options['durable'] = options.durable === undefined ? false : options.durable;
		options['auto-delete'] = options.autoDelete === undefined ? false : options.autoDelete;
		options['exclusive'] = options.exclusive === undefined ? false : options.exclusive;

		return options;
	}

	encode(msg) {

		return JSON.stringify(msg);
	}

	decode(msg) {

		return JSON.parse(msg);
	}
};
exports.default = PatternBase;