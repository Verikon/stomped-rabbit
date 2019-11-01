var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PatternBase from './PatternBase';
export default class RPC extends PatternBase {
    constructor(props) {
        super(props);
    }
    /**
     * Create an RPC listener.
     *
     * If you're actually legit using this , please DM me as to how/why as i can't think of a single use case for this other than
     * to itch my completionism.
     *
     */
    provision(queue, fn, options) {
        return __awaiter(this, void 0, void 0, function* () {
            //ensure we dont' already have a provision.
            if (this.main.provisions[queue])
                return { success: false, error: 'Queue `' + queue + '` already has a provision' };
            //parse the options
            options = this.parseOptions(options);
            let prov = this.stomp.subscribe(this.toURL(queue, options), (frame) => __awaiter(this, void 0, void 0, function* () {
                let replyQueue;
                try {
                    const { body, headers } = frame;
                    let args, result;
                    ///to error handle or not to.
                    replyQueue = headers['reply-to'];
                    //decode the message to args.
                    args = this.decode(body);
                    //invoke the listening function
                    try {
                        result = fn(args);
                        if (result instanceof Promise)
                            yield result;
                        result = this.encode(result);
                    }
                    catch (err) {
                        result = this.errorHandle(err);
                    }
                    //insert a way to deal with acceptable TTL.
                    this.stomp.send(replyQueue, {}, result);
                }
                catch (err) {
                    this.stomp.send('/queue/' + replyQueue, this.errorHandle(err));
                }
            }), options.queue);
            this.main.provisions[queue] = Object.assign(prov, { type: 'rpc' });
            return { success: true, provision: this.main.provisions[queue] };
        });
    }
    /**
     * Deprovision an endpoint.
     */
    deprovision(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            this.main.provisions[queue].unsubscribe();
            delete this.main.provisions[queue];
            return { success: true };
        });
    }
    /**
     * Invoke an RPC listener
     *
     * @param {String} queue the queue/endpoint to the RPC listener.
     * @param {*} message the message being sent as arguments to the listener.
     * @param {Object} options an options object
     * @param {Number} options.timeout allowable time for response in milliseconds. A value of zero is infinite. Default, 15 seconds.
     * @returns {Promise} resolves with the RPC response.
     */
    invoke(queue, message, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            //parse the options.
            const parsedOptions = this.parseOptions(options);
            //apply alloweable timeout to the RPC pattern.Not done in the parseOptions baseclass method as this should be unique to the pattern.
            if (options.timeout !== undefined)
                parsedOptions.timeout = options.timeout;
            //encode the options.
            message = this.encode(message);
            let timer;
            //create a response queue and apply it to the options.
            let responseQueue = 'stomped-' + (Math.random() * 10000000).toString();
            parsedOptions.queue['reply-to'] = responseQueue;
            //set up the listener on the response queue, autodeleting it (this is an exclusive use)
            this.stomp.subscribe(responseQueue, frame => {
                try {
                    let response = this.decode(frame.body);
                    this.stomp.unsubscribe(responseQueue);
                    if (timer)
                        clearTimeout(timer);
                    resolve(response);
                }
                catch (err) {
                    reject(err);
                }
            }, { id: responseQueue, 'exclusive': true });
            //evaluating a number here, where 0 is false obviously.
            if (parsedOptions.timeout) {
                setTimeout(e => {
                    resolve({ success: false, errored: true, message: 'rpc invocation timed out on queue ' + queue + ' after ' + parsedOptions.timeout + 'ms', errorType: 'TIMEOUT' });
                }, parsedOptions.timeout);
            }
            //fire off the rpc invocation.
            this.stomp.send(this.toURL(queue, parsedOptions), parsedOptions.queue, message);
        });
    }
}
