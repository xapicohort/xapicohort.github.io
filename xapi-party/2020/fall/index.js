var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var app = {
    init: function () {
        this.populateSessionRecordings();
    },
    getData: function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, filePath, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = '//s3.us-east-2.amazonaws.com/torrancelearning/internal/web/events/xapi-party.json';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(filePath)];
                    case 2:
                        response = _a.sent();
                        data = response.json();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('error getting data:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, data];
                }
            });
        });
    },
    getRecordingUrl: function (session, type) {
        var displayKey = type + '.display';
        var urlKey = type + '.url';
        // TODO: turn off fallback for real sessions
        var display = session[displayKey] || 'Session Recording';
        var url = session[urlKey] || 'https://www.youtube.com/embed/ScMzIvxBSi4';
        var isSessionRecording = display === 'Session Recording';
        var random = Math.random();
        if (random > 0.25) {
            return '';
        }
        if (isSessionRecording && url) {
            return url;
        }
        else {
            return '';
        }
    },
    getRecordingEmbedHtml: function (url, title, names) {
        if (title === void 0) { title = ''; }
        if (names === void 0) { names = ''; }
        var embedHtml = "\n\t\t\t<div class=\"embed-container\">\n\t\t\t\t<div>\n\t\t\t\t\t<h3 class=\"session-recording-title\">" + title + "</h3>\n\t\t\t\t\t<div class=\"session-recording-names\">" + names + "</div>\n\t\t\t\t</div>\n\t\t\t\t<iframe src=\"" + url + "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n\t\t\t</div>\n\t\t";
        // width="360" height="240"
        return embedHtml;
    },
    populateSessionRecordings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessionData, recordingsHtml, recordingsEl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getData()];
                    case 1:
                        sessionData = _a.sent();
                        if (!sessionData) {
                            return [2 /*return*/];
                        }
                        recordingsHtml = sessionData
                            .filter(function (sessionBlock) {
                            var session = sessionBlock.data;
                            var recordings = [];
                            for (var i = 1; i <= 2; i++) {
                                var thisLink = _this.getRecordingUrl(session, "link" + i);
                                if (thisLink) {
                                    recordings.push(thisLink);
                                }
                            }
                            if (recordings.length) {
                                session[0].recordings = recordings;
                                return true;
                            }
                        })
                            .map(function (sessionBlock) {
                            var session = sessionBlock.data;
                            var sessionData = session[0] || [];
                            var title = sessionData.title, names = sessionData.names, recordings = sessionData.recordings;
                            return recordings
                                .map(function (url) {
                                if (url) {
                                    return _this.getRecordingEmbedHtml(url, title, names);
                                }
                            })
                                .filter(function (rec) { return rec; })
                                .join('');
                        })
                            .join('') || 'Recordings will be added as they are generated.';
                        recordingsEl = document.querySelector('.session-recordings-container');
                        recordingsEl === null || recordingsEl === void 0 ? void 0 : recordingsEl.insertAdjacentHTML('afterend', recordingsHtml);
                        return [2 /*return*/];
                }
            });
        });
    },
};
document.addEventListener('DOMContentLoaded', app.init.bind(app));
//# sourceMappingURL=index.js.map