import {ClientOptions as IClientOptions} from './types';

import {StompedRabbit} from './StompedRabbit';

export class Client {
   
    sr;
    endpoint;
    exchange;
    debug;

    constructor( endpoint:string, options:IClientOptions = {} ) {

        this.endpoint = endpoint || null;
        this.exchange = options.exchange || null;
        this.debug = options.debug === undefined ? false : options.debug;
    }

    async connect():Promise<any> {

        let result;

        const {endpoint, exchange} = this;

        let config = {
            endpoint,
            exchange
        };

        this.sr = new StompedRabbit();
        this.sr.configure(config);

        await this.sr.connect();
    }

    query() {

        return this.sr;
    }


}