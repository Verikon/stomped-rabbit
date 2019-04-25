import PatternBase from './PatternBase';

export default class CTE extends PatternBase {

	constructor( props ) {

		super(props);
	}

	/**
	 * Provision a CTE listener
	 * 
	 * @param queue The name of the queue to listen to
	 * @param key the routing key to dispatch to on the exchange
	 * @param fn listener function with signature :(message, frame, {mutateKey:Fn})
	 * @param options the options object
	 * @param options.type the type of exchange: "fanout", "direct", "topic"; default is topic.
	 * @param options.exchange an exchange to dispatch, default is the default exchange.
	 */
	async provision( queue:string, key:string, fn:Function, options ) {

		options = options || {};
		options.type = options.type || 'topic';

		const parsedOptions = this.parseOptions(options);

		if(options.debug) {
			console.log('\n\n');
			console.log('Provisioning CTE');
			console.log(`Receiving via queue "${queue}"`)
			console.log(`Repying on exchange "${parsedOptions.endpoint+key}"`);
		}

		//set up the listener on the response queue, autodeleting it (this is an exclusive use)
		this.stomp.subscribe(queue, async frame => {

			const mutateKey = value => key = value;

			const message = this.decode(frame.body);
			const response = await fn(message, frame, {mutateKey});
			const reply = this.encode(response);

			this.stomp.send(parsedOptions.endpoint+key, {}, reply);

		}, {id: key});

		return true;
	}

	async deprovision() {

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
	async invoke( queue, message, options ) {

		options = options || {};

		//parse the options.
		const parsedOptions = this.parseOptions(options);

		//encode the options.
		message = this.encode(message);

		//fire off the message.
		this.stomp.send(this.toURL(queue, parsedOptions), parsedOptions.queue, message);

	}

}
