import PatternBase from './PatternBase';

export default class Topoic extends PatternBase {

	constructor( props ) {

		super(props);
	}

	/**
	 * Create an Topic Exchange listener.
	 * 
	 * @param key the routing key to listen on
	 * @param fn The listener function with signature :(message, frame, {mutateKey:Fn})
	 * @param options an options object
	 * @param options.exchange the exchange to use, default is the default topic exchange
	 * 
	 */
	async provision( key:string, fn:Function, options ) {

		options = options || {};
		options.type = 'topic';

		const parsedOptions = this.parseOptions(options);

		if(options.debug) {
			console.log(`\nProvisioned Topic listener at "${parsedOptions.endpoint+key}"`)
		}

		this.stomp.subscribe(parsedOptions.endpoint+key, async frame => {

			const message = this.decode(frame.body);
			await fn(message, frame);

		});

		return true;
	}

	async deprovision() {

	}

	/**
	 * Invoke a Topic listener
	 * 
	 * @param {String} queue the queue/endpoint to the Topic listener.
	 * @param {*} the message being sent as arguments to the listener.
	 * @param {Object} an options object
	 * 
	 * @returns {Promise} resolves {true}
	 */
	async invoke( queue, message, options ) {

	}

}
