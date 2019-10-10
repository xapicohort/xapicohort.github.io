var app = {
	init: function () {
		this.getData(this.showList);
	},

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

	showList: function (teamList) {
		var loader = document.querySelector('.page-loading');
		loader.classList.add('hidden');

		console.log('teamList:', teamList);

		try {
			var metricsTeamsEl = document.querySelector('.metrics-teams');
			metricsTeamsEl.innerHTML = teamList.length;

			var metricsMembersEl = document.querySelector('.metrics-members');
			var metricsMembersCount = 0;

			var html = '';
			teamList.forEach(function (team) {
				metricsMembersCount += team.members.totalCount;
				var discussions = team.discussions.nodes;

				var longDesc = app.getTeamLongDescription(discussions);
				var teamUpdate = app.getTeamUpdates(discussions);

				var longDescHtml = '';
				var teamUpdatePublishDate = 'No updates';
				var teamUpdateHtml = '';

				if (longDesc) {
					longDescHtml += '<div class="block-title">Long Description:';
					longDescHtml += '<button class="btn long-desc-btn" data-id="' + team.id + '">View</button>';
					longDescHtml += '</div>';
					longDescHtml += '<div class="description-long hidden" data-id="' + team.id + '">';
					// longDescHtml += '<h4 class="team-update-title">Description</h4>'; // '+ team.name +' 
					longDescHtml += longDesc.bodyHTML;
					longDescHtml += '</div>';
				}

				if (teamUpdate) {
					var referenceDate = teamUpdate.updatedAt || teamUpdate.publishedAt || '';

					teamUpdatePublishDate = new Date(referenceDate).toLocaleString();

					teamUpdateHtml += '<div class="team-update">';
					teamUpdateHtml += '<h4 class="team-update-title">' + teamUpdate.title + '</h4>';
					teamUpdateHtml += teamUpdate.bodyHTML;
					teamUpdateHtml += '</div>';
				}

				html += '<section>';
				html += '<h3><a target="_blank" href="' + team.url + '">' + team.name + '</a></h3>';
				html += '<div class="team-body">';

				html += '<p class="description-short">' + team.description + '</p>';

				html += '<div class="team-data-block">';

				html += longDescHtml ? longDescHtml : '<div class="block-title">Long Description: <span class="block-title-value">None<span></div>';
				;

				html += '<div class="block-title">Members:';
				html += '<span class="block-title-value">' + team.members.totalCount + '</span>';
				html += '</div>';

				html += '<div class="block-title">Last Updated:';
				html += '<span class="block-title-value">' + teamUpdatePublishDate + '</span>';
				html += '</div>';
				html += '</div>';

				html += teamUpdateHtml;

				html += '</div>';
				html += '</section>';
			});

			metricsMembersEl.innerHTML = metricsMembersCount;

			var teamListEl = document.querySelector('.team-list');
			teamListEl.insertAdjacentHTML('beforeend', html);

			app.bindTeamEvents();

		} catch (error) {
			console.error('error:', error);
		}
	},

	bindTeamEvents: function () {
		document.addEventListener('click', function (e) {
			var target = e.target;

			var isLongDescBtn = target.classList.contains('long-desc-btn');

			if (isLongDescBtn) {
				var id = target.dataset.id;

				var longDescEl = document.querySelector('.description-long[data-id="' + id + '"]');

				longDescEl.classList.toggle('hidden');
			}
		});
	},

	getTeamUpdates: function (discussions) {
		var discussionsSorted = discussions.sort(function(a, b) {
			var pubA = new Date(a.publishedAt);
			var pubB = new Date(b.publishedAt);

			if (pubA < pubB) { return -1; }
			if (pubA > pubB) { return 1; }
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