import {StompedRabbit} from './StompedRabbit';


const StompRabbitInstance = new StompedRabbit();

export const withStompedRabbit = function( args ) {

	args = args || {};

	return function( target ) {

		var configure;

		//if our decorator is argued a config and isn't instanced.
		configure = !!(!StompRabbitInstance.configured );

		//if this is a react component
		if( target.prototype.isReactComponent ){

			return function( props, name, descriptor ) {

				props = props || {};

				let config = {};

				config.config = args.config || props.config.mq;
				config.dispatch = props.dispatch || null;
				config.connect = config.connect === undefined ? true : config.connect;

				//if we're instantiating the class ( ie. StompRabbitInstance is null/not an instance, and we've been argued a config into the decorator )
				if(configure && !StompRabbitInstance.configured) {

					//if( props.dispatch ) args = Object.assign({dispatch: props.dispatch}, args);
					StompRabbitInstance.configure(config)

					//warn that without a dispatcher, we won't be dispatching anything to the redux store.
					if(!props.dispatch) {
						console.warn( 'RabbitRedux has instantiated but in order to dispatch actions, requires the redux store dispatcher be present, did you decorate with redux connect, and after it?' );
					}

				}

				var newProps = Object.assign( {}, props );
				newProps.mq = StompRabbitInstance;
				return React.createElement( target, newProps );
			}

		}
		else {

			target.prototype.mq = StompRabbitInstance;
		}

	}

}
