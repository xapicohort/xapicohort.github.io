var app = {
    init: function () {
        this.getData(this.buildList.bind(this));
    },
    metricsMembersCount: 0,
    getData: function (cb) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var list = this.responseText;
                var json = typeof list === 'string' ? JSON.parse(list) : list;
                cb(json);
            }
        });
        xhr.open("GET", "https://slack-github-teambot.mpkliewer.now.sh/api/public/github?endpoint=teams");
        // xhr.open("GET", "http://localhost:3000/api/public/github?endpoint=teams");
        xhr.send();
    },
    buildList: function (teamList) {
        console.log('teamList:', teamList);
        var metricsTeamsEl = document.querySelector('.metrics-teams');
        if (metricsTeamsEl) {
            metricsTeamsEl.innerHTML = teamList.length;
        }
        var teamChoices = teamList.map(function (team, index) {
            var name = team.name, id = team.id;
            var classAttribute = index === 0 ? 'selected' : '';
            return "\n\t\t\t\t<li class=\"team-choice " + classAttribute + "\" data-id=\"" + id + "\">" + name + "</li>\n\t\t\t";
        }).join('');
        var teamChoiceHtml = "\n\t\t\t<ul class=\"team-choice-list\">" + teamChoices + "</ul>\n\t\t";
        var teamHtml = teamList.map(this.createListItem).join('');
        this.showList(teamChoiceHtml, teamHtml);
    },
    createListItem: function (team, index) {
        var html = '';
        app.metricsMembersCount += team.members.totalCount;
        var discussions = team.discussions.nodes;
        var longDesc = app.getTeamLongDescription(discussions);
        var teamUpdate = app.getTeamUpdates(discussions);
        var longDescHtml = '';
        var teamUpdatePublishDate = 'No updates';
        var teamUpdateHtml = '';
        if (longDesc) {
            longDescHtml += "\n\t\t\t\t<div class=\"block-title\">\n\t\t\t\t\t<span>Long Description:</span>\n\t\t\t\t\t<button class=\"btn long-desc-btn\" data-id=\"" + team.id + "\">View</button>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"description-long hidden\" data-id=\"" + team.id + "\">\n\t\t\t\t\t" + longDesc.bodyHTML + "\n\t\t\t\t</div>\n\t\t\t";
        }
        if (teamUpdate) {
            var referenceDate = teamUpdate.updatedAt || teamUpdate.publishedAt || '';
            teamUpdatePublishDate = new Date(referenceDate).toLocaleString();
            teamUpdateHtml += "\n\t\t\t\t<div class=\"team-update\">\n\t\t\t\t\t<h4 class=\"team-update-title\">" + teamUpdate.title + "</h4>\n\t\t\t\t\t" + teamUpdate.bodyHTML + "\n\t\t\t\t</div>\n\t\t\t";
        }
        var memberList = team.members.nodes.map(function (member) {
            var memberName = member.name ? " (" + member.name + ")" : '';
            return "\n\t\t\t\t<div>\n\t\t\t\t\t<a href=\"https://github.com/orgs/xapicohort/people/" + member.login + "\" target=\"_blank\">" + member.login + memberName + "</a>\n\t\t\t\t</div>\n\t\t\t";
        }).join('');
        html += "\n\t\t\t<section data-id=\"" + team.id + "\" " + (index === 0 ? 'class="selected"' : '') + ">\n\t\t\t\t<h3><a target=\"_blank\" href=\"" + team.url + "\">" + team.name + "</a></h3>\n\n\t\t\t\t<div class=\"team-body\">\n\t\t\t\t\t<p class=\"description-short\">" + (team.description || '(No description)') + "</p>\n\n\t\t\t\t\t<div class=\"team-data-block\">\n\t\t\t\t\t\t" + (longDescHtml ? longDescHtml : '<div class="block-title">Long Description: <span class="block-title-value">None<span></div>') + "\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class=\"block-title\">\n\t\t\t\t\t\t\t<span>Members:</span>\n\t\t\t\t\t\t\t<span class=\"block-title-value\">" + team.members.totalCount + "</span>\n\t\t\t\t\t\t\t<button class=\"btn member-list-btn\" data-id=\"" + team.id + "\">View</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t<div class=\"member-list hidden\" data-id=\"" + team.id + "\">\n\t\t\t\t\t\t\t" + memberList + "\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"block-title\">\n\t\t\t\t\t\t\t<span>Last Updated:</span>\n\t\t\t\t\t\t\t<span class=\"block-title-value\">" + teamUpdatePublishDate + "</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t" + teamUpdateHtml + "\n\n\t\t\t\t</div>\n\t\t\t</section>\n\t\t";
        return html;
    },
    showList: function (teamChoiceHtml, teamHtml) {
        var loader = document.querySelector('.page-loading');
        if (loader) {
            loader.classList.add('hidden');
        }
        var metricsMembersEl = document.querySelector('.metrics-members');
        if (metricsMembersEl) {
            metricsMembersEl.innerHTML = this.metricsMembersCount.toString();
        }
        var teamChoiceListEl = document.querySelector('.team-choice-list-wrapper');
        var teamListEl = document.querySelector('.team-list');
        if (teamChoiceListEl && teamListEl) {
            teamChoiceListEl.insertAdjacentHTML('beforeend', teamChoiceHtml);
            teamListEl.insertAdjacentHTML('beforeend', teamHtml);
        }
        app.bindTeamEvents();
    },
    bindTeamEvents: function () {
        document.addEventListener('click', function (e) {
            var target = e.target;
            var classList = target.classList;
            var id = target.dataset.id;
            var isTeamChoice = classList.contains('team-choice');
            var isLongDescBtn = classList.contains('long-desc-btn');
            var isMemberListBtn = classList.contains('member-list-btn');
            var isViewSwitcher = classList.contains('view-switcher-btn');
            if (isTeamChoice) {
                var otherSelected = document.querySelectorAll('main .selected');
                var matchingSection = document.querySelector("section[data-id=\"" + id + "\"]");
                otherSelected.forEach(function (other) {
                    other.classList.remove('selected');
                });
                classList.add('selected');
                if (matchingSection) {
                    matchingSection.classList.add('selected');
                }
            }
            if (isLongDescBtn) {
                var longDescEl = document.querySelector(".description-long[data-id=\"" + id + "\"]");
                if (longDescEl) {
                    longDescEl.classList.toggle('hidden');
                }
            }
            if (isMemberListBtn) {
                var memberListEl = document.querySelector(".member-list[data-id=\"" + id + "\"]");
                if (memberListEl) {
                    memberListEl.classList.toggle('hidden');
                }
            }
            if (isViewSwitcher) {
                document.body.classList.toggle('long-list-display');
            }
        });
    },
    getTeamUpdates: function (discussions) {
        var discussionsSorted = discussions.sort(function (a, b) {
            var pubA = new Date(a.publishedAt);
            var pubB = new Date(b.publishedAt);
            if (pubA < pubB) {
                return -1;
            }
            if (pubA > pubB) {
                return 1;
            }
            return 0;
        }).reverse();
        var update = discussionsSorted.filter(function (disc) {
            var title = disc.title || '';
            title = title.toLowerCase();
            var hasUpdate = title.indexOf('update') > -1;
            var hasStatus = title.indexOf('status') > -1;
            return hasUpdate || hasStatus;
        })[0];
        return update;
    },
    getTeamLongDescription: function (discussions) {
        var longDesc = discussions.filter(function (disc) {
            return disc.isPinned;
        })[0];
        return longDesc;
    },
};
window.addEventListener('DOMContentLoaded', function () {
    app.init();
});
//# sourceMappingURL=index.js.map