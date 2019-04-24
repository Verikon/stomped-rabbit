"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var PatternBase_1 = require("./PatternBase");
var RPC = /** @class */ (function (_super) {
    __extends(RPC, _super);
    function RPC(props) {
        return _super.call(this, props) || this;
    }
    /**
     * Create an RPC listener.
     *
     * If you're actually legit using this , please DM me as to how/why as i can't think of a single use case for this other than
     * to itch my completionism.
     *
     */
    RPC.prototype.provision = function (queue, fn, options) {
        return __awaiter(this, void 0, void 0, function () {
            var prov;
            var _this = this;
            return __generator(this, function (_a) {
                //ensure we dont' already have a provision.
                if (this.main.provisions[queue])
                    return [2 /*return*/, { success: false, error: 'Queue `' + queue + '` already has a provision' }
                        //parse the options
                    ];
                //parse the options
                options = this.parseOptions(options);
                prov = this.stomp.subscribe(this.toURL(queue, options), function (frame) { return __awaiter(_this, void 0, void 0, function () {
                    var replyQueue, body, headers, args, result, err_1, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 6, , 7]);
                                body = frame.body, headers = frame.headers;
                                args = void 0, result = void 0;
                                ///to error handle or not to.
                                replyQueue = headers['reply-to'];
                                //decode the message to args.
                                args = this.decode(body);
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                result = fn(args);
                                if (!(result instanceof Promise)) return [3 /*break*/, 3];
                                return [4 /*yield*/, result];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                result = this.encode(result);
                                return [3 /*break*/, 5];
                            case 4:
                                err_1 = _a.sent();
                                result = this.errorHandle(err_1);
                                return [3 /*break*/, 5];
                            case 5:
                                //insert a way to deal with acceptable TTL.
                                this.stomp.send(replyQueue, {}, result);
                                return [3 /*break*/, 7];
                            case 6:
                                err_2 = _a.sent();
                                this.stomp.send('/queue/' + replyQueue, this.errorHandle(err_2));
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); }, options.queue);
                this.main.provisions[queue] = Object.assign(prov, { type: 'rpc' });
                return [2 /*return*/, { success: true, provision: this.main.provisions[queue] }];
            });
        });
    };
    /**
     * Deprovision an endpoint.
     */
    RPC.prototype.deprovision = function (queue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.main.provisions[queue].unsubscribe();
                delete this.main.provisions[queue];
                return [2 /*return*/, { success: true }];
            });
        });
    };
    /**
     * Invoke an RPC listener
     *
     * @param {String} queue the queue/endpoint to the RPC listener.
     * @param {*} message the message being sent as arguments to the listener.
     * @param {Object} options an options object
     * @param {Number} options.timeout default, no timeout.
     * @returns {Promise} resolves with the RPC response.
     */
    RPC.prototype.invoke = function (queue, message, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            options = options || {};
            //parse the options.
            var parsedOptions = _this.parseOptions(options);
            //apply alloweable timeout to the RPC pattern.Not done in the parseOptions baseclass method as this should be unique to the pattern.
            if (options.timeout)
                parsedOptions.timeout = options.timeout;
            //encode the options.
            message = _this.encode(message);
            var timer;
            //create a response queue and apply it to the options.
            var responseQueue = 'stomped-' + (Math.random() * 10000000).toString();
            parsedOptions.queue['reply-to'] = responseQueue;
            //set up the listener on the response queue, autodeleting it (this is an exclusive use)
            _this.stomp.subscribe(responseQueue, function (frame) {
                var response = _this.decode(frame.body);
                _this.stomp.unsubscribe(responseQueue);
                if (timer)
                    clearTimeout(timer);
                resolve(response);
            }, { id: responseQueue, 'exclusive': true });
            if (parsedOptions.timeout) {
                setTimeout(function (e) {
                    resolve({ success: false, errored: true, message: 'rpc invocation timed out on queue ' + queue + ' after ' + parsedOptions.timeout + 'ms', errorType: 'TIMEOUT' });
                }, parsedOptions.timeout);
            }
            //fire off the rpc invocation.
            _this.stomp.send(_this.toURL(queue, parsedOptions), parsedOptions.queue, message);
        });
    };
    return RPC;
}(PatternBase_1["default"]));
exports["default"] = RPC;
