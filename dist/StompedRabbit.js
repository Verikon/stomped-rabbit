'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.StompedRabbit = undefined;

var _stompjs = require('stompjs');

var _stompjs2 = _interopRequireDefault(_stompjs);

var _CTE = require('./patterns/CTE');

var _CTE2 = _interopRequireDefault(_CTE);

var _RPC = require('./patterns/RPC');

var _RPC2 = _interopRequireDefault(_RPC);

var _Topic = require('./patterns/Topic');

var _Topic2 = _interopRequireDefault(_Topic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let StompedRabbit = exports.StompedRabbit = class StompedRabbit {

	constructor(props) {

		props = props || {};
		this.setInitialState();
	}

	setInitialState() {

		this.configured = false;
		this.connected = false;
		this.patterns = {};
	}

	/**
  * Configure StompRabbit
  *
  * @param {Object} props.config the configuration object
  * @param {String} props.config.endpoint the endpoint uri ( eg ws://someone:secret@rabbithost:port )
  * @param {Integer} config.heartbeat_incoming milliseconds for incoming heartbeats, default 20000.
  * @param {Integer} config.heartbeat_outgoing milliseconds for outgoing heartbeats, default 0.
  * @param {Boolean} config.debug run the instance in debug mode.
  * @param {Boolean} connect configure and connect.
  *
  * @returns {Promise} {success: true}
  **/
	configure(config, connect) {

		if (!config || !this.realObject(config)) throw new Error('provide a valid config object');

		config.heartbeat_incoming = config.heartbeat_incoming || 20000;
		config.heartbeat_outgoing = config.heartbeat_outgoing || 0;

		config.auth = this.parseEndpoint(config.endpoint);

		this.config = config;

		this.configured = true;

		return { success: true };
	}

	/**
  * Connect the Client.
  * 
  * @param {Object} config the configuration object.
  * @param {String} config.endpoint the websocket uri (eg wss://user:pass@somwhere.com:8888)
 	 * @param {Boolean} config.debug - produce debug information to the console.
  * 
  * @returns {Promise}  
  */
	connect() {

		return new Promise((resolve, reject) => {

			if (this.config) throw new Error('attempting to connect with an unconfigured instance, invoke configure()');

			const { endpoint, auth, heartbeat_incoming, heartbeat_outgoing } = this.config;
			const { user, pass, uri } = auth;

			//instance a new Websocket
			let ws = new WebSocket(endpoint);

			//set up stomp over websockets.
			this.stomp = _stompjs2.default.over(ws);

			// rabbit webstomp does not support heartbeats.
			this.stomp.heartbeat.outgoing = heartbeat_outgoing;
			this.stomp.heartbeat.incoming = heartbeat_incoming;

			this.stomp.connect(user, pass, () => {

				this.bindPatterns();

				Object.keys(this.patterns).forEach(qpattern => {
					this.patterns[qpattern].attachClient(this.stomp);
				});

				this.connected = true;

				resolve(true);
			}, err => {
				reject(err);
			});
		});
	}

	bindPatterns() {

		this.cte = this.patterns.cte = new _CTE2.default({ config: this.config });
		this.rpc = this.patterns.rpc = new _RPC2.default({ config: this.config });
		this.topic = this.patterns.topic = new _Topic2.default({ config: this.config });
	}

	/**
  * Parses the argued endpoint to extract the user, password.
  * 
  * @param {String} endpoint the websocket endpoint
  * 
  * @returns {Object} {user: <username>, pass: <password>, uri: <uri>}
  */
	parseEndpoint(endpoint) {

		let ret, credentials, strippedEndpoint, secured;

		if (typeof endpoint !== 'string') throw new Error('Requires 1 argument - endpoint(string) be argued.');

		if (!endpoint.includes('wss:') && !endpoint.includes('ws:')) console.warn('Invalid Websocket URL ' + endpoint + ' --- needs ws:// or wss://');

		secured = endpoint.includes('wss:');

		//no 'at' symbol means no credentials.
		if (!endpoint.includes('@')) {

			return {
				user: null,
				pass: null,
				uri: endpoint
			};
		}

		try {

			credentials = endpoint.split('@')[0].split('/')[2].split(':');
			strippedEndpoint = endpoint.split('@')[1];
		} catch (e) {

			throw 'User credentials supplied but are unusable on endpoint ' + endpoint;
		}

		return {
			user: credentials[0],
			pass: credentials[1],
			uri: (secured ? 'wss://' : 'ws://') + strippedEndpoint
		};
	}

	_realObject(obj) {

		return !!obj && obj.constructor === Object;
	}
};