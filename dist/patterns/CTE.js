var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PatternBase from './PatternBase';
export default class CTE extends PatternBase {
    constructor(props) {
        super(props);
    }
    /**
     * Provision a CTE listener
     *
     * @param queue The name of the queue to listen to
     * @param key the routing key to dispatch to on the exchange
     * @param fn listener function
     * @param options the options object
     * @param options.type the type of exchange: "fanout", "direct", "topic"; default is topic.
     * @param options.exchange an exchange to dispatch, default is the default exchange.
     */
    provision(queue, key, fn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            options.type = options.type || 'topic';
            const parsedOptions = this.parseOptions(options);
            if (options.debug) {
                console.log('\n\n');
                console.log('Provisioning CTE');
                console.log(`Receiving via queue "${queue}"`);
                console.log(`Repying on exchange "${parsedOptions.endpoint + key}"`);
            }
            //set up the listener on the response queue, autodeleting it (this is an exclusive use)
            this.stomp.subscribe(queue, (frame) => __awaiter(this, void 0, void 0, function* () {
                const mutateKey = value => key = value;
                const message = this.decode(frame.body);
                const response = yield fn(message, { mutateKey });
                const reply = this.encode(response);
                this.stomp.send(parsedOptions.endpoint + key, {}, reply);
            }), { id: key });
            return true;
        });
    }
    deprovision() {
        return __awaiter(this, void 0, void 0, function* () {
        });
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
    invoke(queue, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            //parse the options.
            const parsedOptions = this.parseOptions(options);
            //encode the options.
            message = this.encode(message);
            //fire off the message.
            this.stomp.send(this.toURL(queue, parsedOptions), parsedOptions.queue, message);
        });
    }
}
