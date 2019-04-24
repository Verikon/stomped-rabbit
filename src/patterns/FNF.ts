import PatternBase from './PatternBase';

export default class FNF extends PatternBase {

	constructor( props ) {

		super(props);
	}

	/**
	 * Create a FNF listener
	 */
	async provision( queue:string, options ) {

		/*
		//parse the options
		const toptions = this.parseOptions(options);
		*/
	}

	async deprovision() {

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
	async invoke( queue, message, options ) {

		/*
		//parse the options.
		options = this.parseOptions(options);

		//encode the options.
		message = this.encode(message);
		
		//create a response queue and apply it to the options.
		let responseQueue = 'stomped-'+(Math.random()*100000).toString();
		options['reply-to'] = responseQueue;
		
		//set up the listener on the response queue, autodeleting it (this is an exclusive use)
		this.client.subscribe('/queue/'+responseQueue, frame => {

			let response = this.decode(frame.body);
			this.client.unsubscribe(responseQueue);

			resolve(response);

		}, {id: responseQueue, 'auto-delete': true});

		//fire off the rpc invocation.
		this.client.send('/queue/'+queue, options, )
		*/

	}

}