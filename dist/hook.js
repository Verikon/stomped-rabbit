var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import assert from 'assert';
import { StompedRabbit } from './StompedRabbit';
let instance = {};
export function useStompedRabbit(id, config) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('YOBINGO', id, config);
        id = id || 'main';
        //simple request for an SR instance.
        if (instance[id] && !config)
            return instance[id];
        //request for a non-existing id, and not attempting to configure it.
        if (!instance[id] && !config)
            throw new Error(err(`instance with id:"${id}" does not exist, configure it`));
        //request for an SR instance which exists, but attempting to configure it.
        if (instance[id] && config)
            throw new Error(err(`instance with id "${id}" already exists but you're attempting to configure it`));
        if (!instance[id] && config) {
            yield configure(id, config);
            return instance[id];
        }
    });
}
export function configure(id, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (instance && instance[id])
            throw new Error(`StompedRabbit: instance "${id}" already exists`);
        let result;
        instance[id] = new StompedRabbit();
        result = instance[id].configure(config);
        assert(result.success, err('failed to configure.'));
        result = yield instance[id].connect();
        assert(result, err('failed to connect'));
        return true;
    });
}
function err(message) {
    return `StompedRabbit:: ${message}`;
}
