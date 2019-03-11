import {StompedRabbit} from './StompedRabbit';

export class Client {
   
    sr;
    endpoint;
    exchange;
    debug;

    constructor( endpoint, options = {} ) {

        if(endpoint)
            this.endpoint = endpoint;

        if(options.exchange)
            this.exchange = exchange;

        if(options.debug !== undefined)
            this.debug = options.debug;
        }

    async connect() {

        let result;

        const {endpoint, exchange} = this;

        let config = {
            endpoint,
            exchange
        };

        this.sr = new StompedRabbit(config);
        this.sr.configure(config);

        await this.sr.connect();


    }

    query() {

        return this.sr;
    }


}