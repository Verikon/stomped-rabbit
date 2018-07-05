import PatternBase from './PatternBase';

export default class RPC extends PatternBase {

	constructor( props ) {

		super(props);
	}

	/**
	 * Create an RPC listener.
	 * 
	 * If you're actually legit using this , please DM me as to how/why as i can't think of a single use case for this other than
	 * to itch my completionism.
	 * 
	 */
	async provision( queue, fn, options ) {

		//ensure we dont' already have a provision.
		if(this.main.provisions[queue]) return {success:false, error: 'Queue `'+queue+'` already has a provision'}

		//parse the options
		options = this.parseOptions(options);

		let prov = this.stomp.subscribe(this.toURL(queue, options), async frame => {

			let replyQueue;

			try {

				const {body, headers} = frame;

				let args, result;

				///to error handle or not to.
				replyQueue = headers['reply-to'];

				//decode the message to args.
				args = this.decode(body);

				//invoke the listening function
				try {
					result = fn(args);
					if(result instanceof Promise)
						response = await result;
					result = this.encode(result);
				} catch( err ) {

					result = this.errorHandle(err);
				}

				//insert a way to deal with acceptable TTL.

				this.stomp.send(replyQueue,{}, result);

			} catch ( err ) {

				this.stomp.send('/queue/'+replyQueue, this.errorHandle(err) );
			}

		}, options.queue);

		this.main.provisions[queue] = Object.assign(prov, {type:'rpc'});

		return {success: true, provision: this.main.provisions[queue]};
	}

	/**
	 * Deprovision an endpoint.
	 */
	async deprovision( queue ) {

		this.main.provisions[queue].unsubscribe();
		delete this.main.provisions[queue];

		return {success: true};
	}

	/**
	 * Invoke an RPC listener
	 * 
	 * @param {String} queue the queue/endpoint to the RPC listener.
	 * @param {*} the message being sent as arguments to the listener.
	 * @param {Object} an options object
	 * 
	 * @returns {Promise} resolves with the RPC response.
	 */
	invoke( queue, message, options ) {

		return new Promise((resolve, reject) => {

			//parse the options.
			options = this.parseOptions(options);

			//encode the options.
			message = this.encode(message);
		
			//create a response queue and apply it to the options.
			let responseQueue = 'stomped-'+parseInt(Math.random() * 10000000, 10);
			options.queue['reply-to'] = responseQueue;

			//set up the listener on the response queue, autodeleting it (this is an exclusive use)
			this.stomp.subscribe(responseQueue, frame => {

				let response = this.decode(frame.body);
				this.stomp.unsubscribe(responseQueue);

				resolve(response);

			}, {id: responseQueue, 'exclusive': true});

			//fire off the rpc invocation.
			this.stomp.send(this.toURL(queue, options), options.queue, message);

		});

	}

}
