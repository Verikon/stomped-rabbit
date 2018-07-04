import {StompedRabbit} from './StompedRabbit';
import crypto from 'crypto';

let RabbitInstances = {
	default: null
};

/**
 * Decorate a class with an instance of StompedMongo
 * 
 * @param {Object} args the argument object
 * @param {}
 * 
 * @returns {} 
 */
export function withStompedRabbit( args ) {

	args = args || {};

	let {initialize, key, config, instance} = args;

	//default initialize false (should be true...)
	initialize = initialize === undefined ? false : initialize;

	//default the instance to the default singleton
	instance = instance === undefined ? 'default' : instance;

	//default key to "db" @todo: make this "mg"
	key = key || 'mq';

	//check to ensure we have a config if we're initializing, or throw.
	if(initialize) {
		if(!config) console.error('Decorating StompedRabbit with `initialize:true` requires a config be optioned.');
		if(!config.endpoint) console.error('Decorate configuration as `config:{endpoint:<rabbit url>}`');
	}

	return function( target ) {

		class WrappedRabbit extends target {

			constructor( cargs ) {

				super(cargs);

				let id = crypto.randomBytes(16).toString("hex");

				if(!RabbitInstances[instance] || !(RabbitInstances[instance].inst instanceof StompedRabbit)) {
					RabbitInstances[instance] =  {
						inst: new StompedRabbit(args),
						ids: [id]
					};
				} else {
					RabbitInstances[instance].ids.push(id);
				}

				this[key] = RabbitInstances[instance].inst;

			}

		}

		return WrappedRabbit;
	}

}