var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StompedRabbit } from './StompedRabbit';
export class Client {
    constructor(endpoint, options = {}) {
        this.endpoint = endpoint || null;
        this.exchange = options.exchange || null;
        this.debug = options.debug === undefined ? false : options.debug;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const { endpoint, exchange } = this;
            let config = {
                endpoint,
                exchange
            };
            this.sr = new StompedRabbit();
            this.sr.configure(config);
            yield this.sr.connect();
        });
    }
    query() {
        return this.sr;
    }
}
