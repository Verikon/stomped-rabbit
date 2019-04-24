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
class CTE extends PatternBase_1.default {
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
    provision(queue, options) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.default = CTE;
