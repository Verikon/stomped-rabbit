"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PatternBase_1 = __importDefault(require("./PatternBase"));
class FNF extends PatternBase_1.default {
    constructor(props) {
        super(props);
    }
    /**
     * Create a FNF listener
     */
    provision(queue, options) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            //parse the options
            const toptions = this.parseOptions(options);
            */
        });
    }
    deprovision() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Invoke an FNF listener
     *
     * @param {String} queue the queue/endpoint to the RPC listener.
     * @param {*} the message being sent as arguments to the listener.
     * @param {Object} an options object
     *
     * @returns {Promise} resolves with the RPC response.
     */
    invoke(queue, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            //parse the options.
            options = this.parseOptions(options);
    
            //encode the options.
            message = this.encode(message);
            
            //create a response queue and apply it to the options.
            let responseQueue = 'stomped-'+(Math.random()*100000).toString();
            options['reply-to'] = responseQueue;
            
            //set up the listener on the response queue, autodeleting it (this is an exclusive use)
            this.client.subscribe('/queue/'+responseQueue, frame => {
    
                let response = this.decode(frame.body);
                this.client.unsubscribe(responseQueue);
    
                resolve(response);
    
            }, {id: responseQueue, 'auto-delete': true});
    
            //fire off the rpc invocation.
            this.client.send('/queue/'+queue, options, )
            */
        });
    }
}
exports.default = FNF;
