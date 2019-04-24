import PatternBase from './PatternBase';

export default class PubSub extends PatternBase {

	constructor( props ) {

		super(props);
	}

	/**
	 * @param {String} queue the name of the queue
	 * @param {Function} fn the listener function for this subscription
	 * @param {Object} options the options object
	 * 
	 * @see PatternBase::parseOptions();
	 */
	async subscribe( queue, fn, options ) {

		//ensure we dont' already have a provision.
		if(this.main.provisions[queue]) return {success:false, error: 'Queue `'+queue+'` already has a provision'}

		//parse the options
		options = this.parseOptions(options);

		let result;

		let prov = this.stomp.subscribe(this.toURL(queue, options), async frame => {

			try {

				const {body, headers} = frame;
				let args;

				args = this.decode(body);

				fn(args);

			} catch( err ) {

				result = this.errorHandle(err);
			}

		}, options.queue);

		this.main.provisions[queue] = Object.assign(prov, {type:'pubsub'});

		return {success: true, provision: this.main.provisions[queue]};
	}

	async unsubscribe( queue ) {

		this.main.provisions[queue].unsubscribe();
		delete this.main.provisions[queue];

		return {success: true};
	}

	async publish( queue, message, options ) {

		//parse the options.
		options = this.parseOptions(options);

		//encode the options.
		message = this.encode(message);

		//fire off the rpc invocation.
		this.stomp.send(this.toURL(queue, options), options, message);
	}

}
