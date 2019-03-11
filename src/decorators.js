import {StompedRabbit} from './StompedRabbit';

import co from 'co';

let RabbitInstances = {
	default: null
};

/**
 * Decorate a class with an instance of StompedMongo
 * 
 * @param {Object} args the argument object
 * @param {String} args.instance which instance to use, default : 'default'.
 * @param {String} args.key which attribute to decorate into the class: default 'mq' thus <yourclass>.mq accesses the StompedRabbit instance
 * @param {Boolean} args.initialize initialize upon construction, default true.
 * @param {Object} args.config a configuration object for the instance
 * @param {Function} args.onConnect a callback for when the instance connects
 * @param {Function} args.onConnectError a callback for when the instance fails to connect
 * @param {Function|String} args.config.endpoint the rabbitMQ URI - eg 'ws://user:pass@myrabbit.com:15754' - when a string, the name of the class method to invoke.
 * 
 * @returns {} 
 */
export function withStompedRabbit( args ) {

	args = args || {};

	let {
		initialize,
		key,
		config,
		instance,
		onConnect,
		onConnectError
	} = args;

	//default initialize false (should be true...)
	initialize = initialize === undefined ? true : initialize;

	//default the instance to the default singleton
	instance = instance === undefined ? 'default' : instance;

	//default key to "db" @todo: make this "mg"
	key = key || 'mq';


	//check to ensure we have a config if we're initializing, or throw.
	if(initialize) {
		if(!config) return console.error('StompedRabbit refused to decorate. Either provide a config in the decorator arguments or set initialize false.');
		if(!config.endpoint) return console.error('Decorate configuration as `config:{endpoint:<rabbit url>}`');
	}

	return function( target ) {

		class WrappedRabbit extends target {

			constructor( cargs ) {

				super(cargs);

				let id = parseInt(Math.random()*10000);

				if(!RabbitInstances[instance] || !(RabbitInstances[instance].inst instanceof StompedRabbit)) {

					RabbitInstances[instance] =  {
						inst: new StompedRabbit(args),
						ids: [id]
					};

				} else {

					RabbitInstances[instance].ids.push(id);
				}

				this[key] = RabbitInstances[instance].inst;

				if(initialize) {

					this.decInitialize({onConnect, onConnectError});
				}


			}
			
			async decInitialize({
				onConnect,
				onConnectError
			}) {

				this[key].configure(config);

				let connection = this[key].connect()
					.then(res => {

						if(onConnect) {

							let fn;
							if(typeof onConnect === 'function') fn = onConnect;
							else if(typeof this[onConnect] === 'function') fn = this[onConnect].bind(this);
							else
								console.warn('Stomped-Rabbit::onConnect was neither a function or a class member method');
		
							//were using the lightweight co package to account for the possibility of generators being argued.
							if(fn) { co(function*() { yield fn(); }) }
						}
					})
					.catch(async err => {

						if(onConnectError) {

							let fn;
							if(typeof onConnectError === 'function') fn = onConnectError;
							else if(typeof this[onConnectError] === 'function') fn = this[onConnectError];
							else
								console.warn('Stomped-Rabbit::onConnectError was neither a function or a class member method');

							//were using the lightweight co package to account for the possibility of generators being argued.
							if(fn) { co(function*() { yield fn(err); }) }

						}
					});

				
			}

		}

		return WrappedRabbit;
	}

}