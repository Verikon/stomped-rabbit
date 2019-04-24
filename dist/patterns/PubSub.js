var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PatternBase from './PatternBase';
export default class PubSub extends PatternBase {
    constructor(props) {
        super(props);
    }
    /**
     * @param {String} queue the name of the queue
     * @param {Function} fn the listener function for this subscription
     * @param {Object} options the options object
     *
     * @see PatternBase::parseOptions();
     */
    subscribe(queue, fn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            //ensure we dont' already have a provision.
            if (this.main.provisions[queue])
                return { success: false, error: 'Queue `' + queue + '` already has a provision' };
            //parse the options
            options = this.parseOptions(options);
            let result;
            let prov = this.stomp.subscribe(this.toURL(queue, options), (frame) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { body, headers } = frame;
                    let args;
                    args = this.decode(body);
                    fn(args);
                }
                catch (err) {
                    result = this.errorHandle(err);
                }
            }), options.queue);
            this.main.provisions[queue] = Object.assign(prov, { type: 'pubsub' });
            return { success: true, provision: this.main.provisions[queue] };
        });
    }
    unsubscribe(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.main.provisions[queue].unsubscribe();
            delete this.main.provisions[queue];
            return { success: true };
        });
    }
    publish(queue, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            //parse the options.
            options = this.parseOptions(options);
            //encode the options.
            message = this.encode(message);
            //fire off the rpc invocation.
            this.stomp.send(this.toURL(queue, options), options, message);
        });
    }
}
