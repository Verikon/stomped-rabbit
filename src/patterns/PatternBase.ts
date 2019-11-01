export default class PatternBase {

	main:any;
	stomp:any;

	constructor( props ) {

		this.main = props.instance;
		this.stomp = props.instance.stomp;
	}

	/**
	 * Parse the options
	 * 
	 * @param {Object} options the options object
	 * @param {Boolean} options.durable the queue will remain even on reboot of the MQ server, default false.
	 * @param {Boolean} options.authDelete the queue will delete itself concluding use, default false.
	 * @param {Boolean} options.exclusive the queue will be used by one connection , being deleted when the connection closes, default false.
	 * @param {String} options.type the type of exchange for relevent patterns, valid types are 'fanout', 'direct', 'topic' , default 'fanout'. 
	 * @param {String} options.name the name of the exchange
	 * 
	 * @returns {Obejct} {queue: {durable, auto-delete, exclusive}, exchange:{type} }
	 */
	parseOptions( options ) {

		options = options || {};

		const {config} = this.main;

		let retOptions = {
			queue: {},
			endpoint: '/queue/',
			timeout: options.timeout === undefined ? 15000 : options.timeout
		};

		retOptions.queue['durable'] = options.durable === undefined ? false : options.durable;
		retOptions.queue['auto-delete'] = options.autoDelete === undefined ? false : options.autoDelete;
		retOptions.queue['exclusive'] = options.exclusive === undefined ? false : options.exclusive;

		const resolveExchange = type => {
			
			if(config.name) return `/${config.name}/`;
			
			switch(type) {

				case 'direct': 
					return `/exchange/${options.exchange||config.topic||'amq.direct'}/`;

				case 'fanout':
					return `/exchange/${options.exchange||config.topic||'amq.fanout'}/`;

				case 'topic':
					return `/exchange/${options.exchange||config.topic||'amq.topic'}/`;

				default:
					throw new Error(`Invalid exchange type "${type}" - valid options are "direct", "fanout" or "topic"`);
			}

		};

		if(options.type)
			retOptions.endpoint = resolveExchange(options.type);

		return retOptions;
	}

	logOptions( options ) {

		return 	'[durable:'+options.durable.toString()+
				', autoDelete:'+options.autoDelete.toString()+
				']';
	}

	encode( msg ){

		return msg ? JSON.stringify(msg) : '';
	}

	decode( msg ) {

		return msg ? JSON.parse(msg) : null;
	}

	toURL( queue, options ) {

		return options.endpoint ? options.endpoint+queue : queue;
	}

	toExchange( key, options ) {

		//const exchange = 
		//return options.endpoint+
	}

	errorHandle( err ) {

		return {success:false, error: err.message};
	}

}