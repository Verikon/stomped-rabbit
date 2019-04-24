"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const uuid_1 = require("uuid");
const stompjs_1 = __importDefault(require("stompjs"));
const RPC_1 = __importDefault(require("./patterns/RPC"));
const PubSub_1 = __importDefault(require("./patterns/PubSub"));
class StompedRabbit extends events_1.EventEmitter {
    constructor() {
        super();
        this.configured = false;
        this.connected = false;
        this.patterns = {};
        this.provisions = {};
        this.client_id = null;
        this.config = null;
    }
    /**
     * Configure StompRabbit
     *
     * @param {T.ArguedConfig} props.config @see ./types.ts
     * @param {T.Queue} props.config.queues[] @see ./types.ts
     *
     * @returns {T.Success}
     **/
    configure(config) {
        if (!config || !this._realObject(config))
            throw new Error('provide a valid config object');
        const defaultConfig = {
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
        return new Promise((resolve, reject) => {
            if (!this.config)
                throw new Error('attempting to connect with an unconfigured instance, invoke configure()');
            const { endpoint, auth, heartbeat_incoming, heartbeat_outgoing } = this.config;
            let { debug } = this.config;
            const { user, pass, uri } = auth;
            //instance a new Websocket
            let ws = new WebSocket(endpoint);
            //set up stomp over websockets.
            this.stomp = stompjs_1.default.over(ws);
            //set the debug.
            debug = debug === undefined ? true : debug;
            if (!debug) {
                this.stomp.debug = () => { };
            }
            else if (typeof debug === 'function') {
                this.stomp.debug = debug;
            }
            // rabbit webstomp does not support heartbeats.
            this.stomp.heartbeat.outgoing = heartbeat_outgoing;
            this.stomp.heartbeat.incoming = heartbeat_incoming;
            this.stomp.connect(user, pass, () => {
                this.bindPatterns();
                this.connected = true;
                setTimeout(e => {
                    resolve(true);
                    this.emit('connected');
                }, 500);
            }, err => { reject(err); });
        });
    }
    bindPatterns() {
        //this.cte = this.patterns.cte = new CTE({config: this.config});
        this.pubsub = this.patterns.pubsub = new PubSub_1.default({ instance: this });
        this.rpc = this.patterns.rpc = new RPC_1.default({ instance: this });
        //this.topic = this.patterns.topic = new Topic({config: this.config});
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
    }
    /* test an object to be an instance of Object */
    _realObject(obj) {
        return (!!obj) && (obj.constructor === Object);
    }
    ;
    clientId(refresh) {
        this.client_id = (refresh || !this.client_id) ? uuid_1.v4() : this.client_id;
        return this.client_id;
    }
}
exports.StompedRabbit = StompedRabbit;
