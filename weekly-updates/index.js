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
var updates = {
    seasons: [
        'fall-2020',
    ],
    allSeasonData: [],
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataPromises, _a, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        dataPromises = this.seasons.map(function (season) {
                            return _this.getData(season);
                        });
                        _a = this;
                        return [4 /*yield*/, Promise.all(dataPromises)];
                    case 1:
                        _a.allSeasonData = _b.sent();
                        this.createAllHtml();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('error getting update data:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getData: function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(filename + ".json")];
                    case 1:
                        updateData = _a.sent();
                        return [2 /*return*/, updateData.json()];
                }
            });
        });
    },
    createAllHtml: function () {
        var _this = this;
        console.log('this.allSeasonData:', this.allSeasonData);
        var allSeasonsHtml = this.allSeasonData.map(function (seasonBlock) {
            var season = seasonBlock.season, year = seasonBlock.year, months = seasonBlock.months;
            var seasonName = season + " " + year;
            var monthHmtl = months.map(function (month) {
                var monthName = month.name, dates = month.dates;
                var dateHtml = dates.map(function (date) {
                    var day = date.day, _a = date.week, week = _a === void 0 ? '' : _a, emails = date.emails, recordings = date.recordings, extras = date.extras;
                    var emailHtml = _this.createEmailsHtml(emails);
                    var recordingsHtml = _this.createRecordingsHtml(recordings);
                    var extrasHtml = _this.createExtrasHtml(extras);
                    var dayHtml = "\n\t\t\t\t\t\t<div class=\"date-container\">\n\t\t\t\t\t\t\t<h3>\n\t\t\t\t\t\t\t\t" + (week ? '<span class="week">Week ' + week + '</span> | ' : '') + "\n\t\t\t\t\t\t\t\t<span class=\"date\">" + monthName + " " + day + "</span>\n\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t\t<div class=\"link-container\">\n\t\t\t\t\t\t\t\t" + emailHtml + "\n\t\t\t\t\t\t\t\t" + recordingsHtml + "\n\t\t\t\t\t\t\t\t" + extrasHtml + "\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t";
                    return dayHtml;
                }).join('');
                return dateHtml;
            }).join('');
            return monthHmtl;
        }).join('');
        var containerEl = document.querySelector('.seasons-container');
        containerEl === null || containerEl === void 0 ? void 0 : containerEl.insertAdjacentHTML('afterbegin', allSeasonsHtml);
    },
    createEmailsHtml: function (emails) {
        var _this = this;
        if (emails === void 0) { emails = []; }
        return emails.map(function (email) {
            var title = email.title, link = email.link;
            return _this.createExternalLink(title, link, 'email');
        }).join('');
    },
    createRecordingsHtml: function (recordings) {
        var _this = this;
        if (recordings === void 0) { recordings = []; }
        return recordings.map(function (recording) {
            var title = recording.title, link = recording.link;
            var newTitle = title || 'Session Recording';
            return _this.createExternalLink(newTitle, link, 'video');
        }).join('');
    },
    createExtrasHtml: function (extras) {
        var _this = this;
        if (extras === void 0) { extras = []; }
        return extras.map(function (extra) {
            var type = extra.type, title = extra.title, presenter = extra.presenter, link = extra.link;
            var newTitle = title;
            var linkType = '';
            if (type === 'slides') {
                newTitle = presenter + " | " + title;
                linkType = type;
            }
            return _this.createExternalLink(newTitle, link, linkType);
        }).join('');
    },
    createExternalLink: function (title, link, linkType) {
        var icon = 'fas fa-external-link-alt';
        var titlePrefix = '';
        switch (linkType) {
            case 'email':
                icon = "fas fa-envelope";
                titlePrefix = 'Email';
                break;
            case 'video':
                icon = "fas fa-video";
                titlePrefix = 'Video';
                break;
            case 'slides':
                icon = "fas fa-file-powerpoint";
                titlePrefix = 'Slides';
                break;
            default:
                break;
        }
        var fullTitle = titlePrefix ? "<span class=\"link-type\">" + titlePrefix + "</span>" + title : title;
        return "\n\t\t\t<a href=\"" + link + "\" target=\"_blank\">\n\t\t\t\t<i class=\"" + icon + "\"></i>" + fullTitle + "\n\t\t\t</a>\n\t\t";
    },
};
document.addEventListener('DOMContentLoaded', function () {
    updates.init();
});
//# sourceMappingURL=index.js.map