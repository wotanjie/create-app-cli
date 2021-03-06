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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
var ws_1 = __importDefault(require("ws"));
var path_1 = __importDefault(require("path"));
var EventEmitter_1 = require("./EventEmitter");
var PORT = 1081;
var HMRCreator = /** @class */ (function (_super) {
    __extends(HMRCreator, _super);
    function HMRCreator(workDir) {
        var _this = _super.call(this) || this;
        _this.outputPath = workDir;
        // NOTE:自定义hmr端口
        var wss = new ws_1.default.Server({
            port: PORT,
        });
        wss.on('connection', function (ws) {
            _this.ws = ws;
            _this.emit('connection', {});
        });
        return _this;
    }
    HMRCreator.prototype.send = function (eventName, cb) {
        this.ws.send(eventName, cb);
    };
    HMRCreator.prototype.injectWebSocketScript = function (app, fsy) {
        var _this = this;
        app.get('/', function (req, res) {
            var url = req.url || '/';
            var injectScript = "<script>\n      const socket = new WebSocket('ws://localhost:" + PORT + "')\n      socket.addEventListener('open', (event) => {\n        socket.send('[HMR] is Ready')\n        console.log('[HMR] Start')\n      })\n      socket.addEventListener('message', function(event) {\n        if (event.data === 'reload') {\n          window.location.reload()\n        }\n      })\n      </script>";
            var html = fsy.readFileSync(path_1.default.resolve(_this.outputPath, 'index.html')).toString();
            if (url === '/') {
                var body = html.replace('</body>', injectScript + "</body>");
                res.end(body);
            }
        });
    };
    return HMRCreator;
}(EventEmitter_1.EventEmitter));
exports.HMRCreator = HMRCreator;
