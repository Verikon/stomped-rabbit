import PatternBase from './PatternBase';

export default class CTE extends PatternBase {

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
	async provision( queue, options ) {

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

	}

}
