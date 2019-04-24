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
exports.__esModule = true;
var events_1 = require("events");
var uuid_1 = require("uuid");
var stompjs_1 = require("stompjs");
var RPC_1 = require("./patterns/RPC");
var PubSub_1 = require("./patterns/PubSub");
var StompedRabbit = /** @class */ (function (_super) {
    __extends(StompedRabbit, _super);
    function StompedRabbit() {
        var _this = _super.call(this) || this;
        _this.configured = false;
        _this.connected = false;
        _this.patterns = {};
        _this.provisions = {};
        _this.client_id = null;
        _this.config = null;
        return _this;
    }
    /**
     * Configure StompRabbit
     *
     * @param {T.ArguedConfig} props.config @see ./types.ts
     * @param {T.Queue} props.config.queues[] @see ./types.ts
     *
     * @returns {T.Success}
     **/
    StompedRabbit.prototype.configure = function (config) {
        if (!config || !this._realObject(config))
            throw new Error('provide a valid config object');
        var defaultConfig = {
            heartbeat_incoming: 0,
            heartbeat_outgoing: 5000,
            queues: [],
            direct: null,
            topic: null,
            fanout: null,
            auth: null,
            endpoint: null
        };
        this.config = Object.assign({}, defaultConfig, config);
        this.config.auth = this.parseEndpoint(config.endpoint);
        this.configured = true;
        return { success: true };
    };
    /**
     * Connect the Client.
     *
     * @param {Object} config the configuration object.
     * @param {String} config.endpoint the websocket uri (eg wss://user:pass@somwhere.com:8888)

     * @param {Boolean|Function} config.debug - produce debug information to the console, default: false. When argued true, use default console debugging. When a function one argument exists - the error message as a string.
     *
     * @returns {Promise}
     */
    StompedRabbit.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.config)
                throw new Error('attempting to connect with an unconfigured instance, invoke configure()');
            var _a = _this.config, endpoint = _a.endpoint, auth = _a.auth, heartbeat_incoming = _a.heartbeat_incoming, heartbeat_outgoing = _a.heartbeat_outgoing;
            var debug = _this.config.debug;
            var user = auth.user, pass = auth.pass, uri = auth.uri;
            //instance a new Websocket
            var ws = new WebSocket(endpoint);
            //set up stomp over websockets.
            _this.stomp = stompjs_1["default"].over(ws);
            //set the debug.
            debug = debug === undefined ? true : debug;
            if (!debug) {
                _this.stomp.debug = function () { };
            }
            else if (typeof debug === 'function') {
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
            }, function (err) { reject(err); });
        });
    };
    StompedRabbit.prototype.bindPatterns = function () {
        //this.cte = this.patterns.cte = new CTE({config: this.config});
        this.pubsub = this.patterns.pubsub = new PubSub_1["default"]({ instance: this });
        this.rpc = this.patterns.rpc = new RPC_1["default"]({ instance: this });
        //this.topic = this.patterns.topic = new Topic({config: this.config});
    };
    /**
     * Parses the argued endpoint to extract the user, password.
     *
     * @param {String} endpoint the websocket endpoint structured as ws://user:pass@host:port
     *
     * @returns {Object} {user: <username>, pass: <password>, uri: <uri>}
     */
    StompedRabbit.prototype.parseEndpoint = function (endpoint) {
        var ret, credentials, strippedEndpoint, secured;
        if (typeof endpoint !== 'string')
            throw new Error('Requires 1 argument - endpoint(string) be argued.');
        if (!endpoint.includes('wss:') && !endpoint.includes('ws:'))
            console.warn('Invalid Websocket URL ' + endpoint + ' --- needs ws:// or wss://');
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
        }
        catch (e) {
            throw ('User credentials supplied but are unusable on endpoint ' + endpoint);
        }
        return {
            user: credentials[0],
            pass: credentials[1],
            uri: (secured ? 'wss://' : 'ws://') + strippedEndpoint
        };
    };
    /* test an object to be an instance of Object */
    StompedRabbit.prototype._realObject = function (obj) {
        return (!!obj) && (obj.constructor === Object);
    };
    ;
    StompedRabbit.prototype.clientId = function (refresh) {
        this.client_id = (refresh || !this.client_id) ? uuid_1.v4() : this.client_id;
        return this.client_id;
    };
    return StompedRabbit;
}(events_1.EventEmitter));
exports.StompedRabbit = StompedRabbit;
