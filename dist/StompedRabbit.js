'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.StompedRabbit = undefined;

var _events = require('events');

var _uuid = require('uuid');

var _stompjs = require('stompjs');

var _stompjs2 = _interopRequireDefault(_stompjs);

var _CTE = require('./patterns/CTE');

var _CTE2 = _interopRequireDefault(_CTE);

var _RPC = require('./patterns/RPC');

var _RPC2 = _interopRequireDefault(_RPC);

var _PubSub = require('./patterns/PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

var _Topic = require('./patterns/Topic');

var _Topic2 = _interopRequireDefault(_Topic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let StompedRabbit = exports.StompedRabbit = class StompedRabbit extends _events.EventEmitter {

	constructor(props) {

		props = props || {};

		super(props);

		this.setInitialState();
	}

	setInitialState() {

		this.configured = false;
		this.connected = false;
		this.patterns = {};
		this.provisions = {};
		this.client_id = null;
	}

	/**
  * Configure StompRabbit
  *
  * @param {Object} props.config the configuration object
  * @param {String} props.config.endpoint the endpoint uri ( eg ws://someone:secret@rabbithost:port/stomp/websocket )
  * @param {String} props.config.direct a default direct exchange for the application (you set this up on rabbitMQ)
  * @param {String} props.config.fanout a default fanout exchange for the application (you set this up on rabbitMQ)
  * @param {String} props.config.topic a default topic exchange for the application.
  * @param {Integer} config.heartbeat_incoming milliseconds for incoming heartbeats, default 20000.
  * @param {Integer} config.heartbeat_outgoing milliseconds for outgoing heartbeats, default 0.
  * @param {Boolean} config.debug run the instance in debug mode.
  * @param {Array} config.queues queues to actualise upon conneciton.
  * @param {String} config.queues[].pattern the pattern to use for this queue
  * @param {String} config.queues[].type the type of queue "fanout"|"direct"|"topic"
  * @param {String} config.queues[].name the name or topic pattern for this queue
  * @param {Function} config.queues[].listener the function to listen upon the queue with.
  * @param {Boolean} connect configure and connect.
  * @returns {Promise} {success: true}
  **/
	configure(config) {

		if (!config || !this._realObject(config)) throw new Error('provide a valid config object');

		config.heartbeat_incoming = config.heartbeat_incoming || 0;
		config.heartbeat_outgoing = config.heartbeat_outgoing || 5000;
		console.log('\n\nStompedRabbit Config', config);
		config.direct = config.direct ? config.direct.replace(/\//g, '') : null;
		config.topic = config.topic ? config.topic.replace(/\//g, '') : null;
		config.fanout = config.fanout ? config.fanout.replace(/\//g, '') : null;
		config.auth = this.parseEndpoint(config.endpoint);

		config.queues = config.queues || [];

		this.config = config;

		this.configured = true;

		return { success: true };
	}

	/**
  * Connect the Client.
  * 
  * @param {Object} config the configuration object.
  * @param {String} config.endpoint the websocket uri (eg wss://user:pass@somwhere.com:8888)
 	 * @param {Boolean|Function} config.debug - produce debug information to the console, default: false. When argued true, use default console debugging. When a function one argument exists - the error message as a string.
  * 
  * @returns {Promise}  
  */
	connect() {
		var _this = this;

		return new Promise(function (resolve, reject) {

			if (!_this.config) throw new Error('attempting to connect with an unconfigured instance, invoke configure()');

			const {
				endpoint,
				auth,
				heartbeat_incoming,
				heartbeat_outgoing
			} = _this.config;

			let { debug } = _this.config;

			const {
				user,
				pass,
				uri
			} = auth;

			//instance a new Websocket
			let ws = new WebSocket(endpoint);

			//set up stomp over websockets.
			_this.stomp = _stompjs2.default.over(ws);

			//set the debug.
			debug = debug === undefined ? true : debug;

			if (!debug) {
				_this.stomp.debug = function () {};
			} else if (typeof debug === 'function') {
				_this.stomp.debug = debug;
			}

			// rabbit webstomp does not support heartbeats.
			_this.stomp.heartbeat.outgoing = heartbeat_outgoing;
			_this.stomp.heartbeat.incoming = heartbeat_incoming;

			_this.stomp.connect(user, pass, function () {

				_this.bindPatterns();

				_this.connected = true;

				setTimeout(function (e) {
					resolve(true);
					_this.emit('connected');
				}, 500);
			}, function (err) {
				reject(err);
			});
		});
	}

	bindPatterns() {

		//this.cte = this.patterns.cte = new CTE({config: this.config});
		this.pubsub = this.patterns.pubsub = new _PubSub2.default({ instance: this });
		this.rpc = this.patterns.rpc = new _RPC2.default({ instance: this });
		//this.topic = this.patterns.topic = new Topic({config: this.config});
	}

	/**
  * todo.
  */
	startConfiguredQueues() {
		var _this2 = this;

		return _asyncToGenerator(function* () {

			const { queues } = _this2.config;

			yield Promise.all(queues.map(function (queue) {}));
		})();
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

	clientId(refresh) {

		this.client_id = refresh || !this.client_id ? (0, _uuid.v4)() : this.client_id;
		return this.client_id;
	}

};