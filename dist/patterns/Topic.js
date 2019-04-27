var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PatternBase from './PatternBase';
export default class Topoic extends PatternBase {
    constructor(props) {
        super(props);
    }
    /**
     * Create an Topic Exchange listener.
     *
     * @param key the routing key to listen on
     * @param fn The listener function with signature :(message, frame, {mutateKey:Fn})
     * @param options an options object
     * @param options.exchange the exchange to use, default is the default topic exchange
     *
     */
    provision(key, fn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = options || {};
            options.type = 'topic';
            const parsedOptions = this.parseOptions(options);
            if (options.debug) {
                console.log(`\nProvisioned Topic listener at "${parsedOptions.endpoint + key}"`);
            }
            this.stomp.subscribe(parsedOptions.endpoint + key, (frame) => __awaiter(this, void 0, void 0, function* () {
                const message = this.decode(frame.body);
                yield fn(message, frame);
            }));
            return true;
        });
    }
    deprovision() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Invoke a Topic listener
     *
     * @param {String} queue the queue/endpoint to the Topic listener.
     * @param {*} the message being sent as arguments to the listener.
     * @param {Object} an options object
     *
     * @returns {Promise} resolves {true}
     */
    invoke(queue, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
