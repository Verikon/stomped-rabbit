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
var PubSub = /** @class */ (function (_super) {
    __extends(PubSub, _super);
    function PubSub(props) {
        return _super.call(this, props) || this;
    }
    /**
     * @param {String} queue the name of the queue
     * @param {Function} fn the listener function for this subscription
     * @param {Object} options the options object
     *
     * @see PatternBase::parseOptions();
     */
    PubSub.prototype.subscribe = function (queue, fn, options) {
        return __awaiter(this, void 0, void 0, function () {
            var result, prov;
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
                    var body, headers, args;
                    return __generator(this, function (_a) {
                        try {
                            body = frame.body, headers = frame.headers;
                            args = void 0;
                            args = this.decode(body);
                            fn(args);
                        }
                        catch (err) {
                            result = this.errorHandle(err);
                        }
                        return [2 /*return*/];
                    });
                }); }, options.queue);
                this.main.provisions[queue] = Object.assign(prov, { type: 'pubsub' });
                return [2 /*return*/, { success: true, provision: this.main.provisions[queue] }];
            });
        });
    };
    PubSub.prototype.unsubscribe = function (queue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.main.provisions[queue].unsubscribe();
                delete this.main.provisions[queue];
                return [2 /*return*/, { success: true }];
            });
        });
    };
    PubSub.prototype.publish = function (queue, message, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //parse the options.
                options = this.parseOptions(options);
                //encode the options.
                message = this.encode(message);
                //fire off the rpc invocation.
                this.stomp.send(this.toURL(queue, options), options, message);
                return [2 /*return*/];
            });
        });
    };
    return PubSub;
}(PatternBase_1["default"]));
exports["default"] = PubSub;
