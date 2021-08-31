const app = {
	init() {
		this.query = this.parseQuery();
		const { season = 'current' } = this.query;

		this.season = season;

		this.updateSeasonDropdown();

		this.getData(this.buildList.bind(this));
	},

	metricsMembersCount: 0,

	parseQuery(fullQuery?: any) {
		fullQuery = fullQuery || window.location.search || window.location.href || '';
		if (!fullQuery) { return; }
		var query = {};
		var queryString = fullQuery.split('?')[1];
		if (!queryString) { return query };
		var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split('=');
			query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
		}
		return query;
	},

	updateSeasonDropdown() {
		var seasonSelectEl: any = document.querySelector('#season-select');

		if (!seasonSelectEl) { return; }

		const { children = [] } = seasonSelectEl || {};

		for (let opt = 0; opt < children.length; opt++) {
			const optionEl: any = children[opt];

			optionEl.removeAttribute('selected');
			optionEl.selected = false;

			if (optionEl.value === this.season) {
				optionEl.selected = true;
			}
		}

		seasonSelectEl.addEventListener('change', function() {
			window.location.search = '?season=' + this.value;
		});

	},

	getData(cb: any) {
		const xhr = new XMLHttpRequest();

		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				const githubData = this.responseText;
				const data = typeof githubData === 'string' ? JSON.parse(githubData) : githubData;

				cb(data);
			}
		});

		xhr.open("GET", "https://slack-github-teambot.vercel.app/api/public/github?endpoint=teams&season=" + this.season);
		// xhr.open("GET", "http://localhost:3000/api/public/github?endpoint=teams&season=" + this.season);

		xhr.send();
	},

	buildList(githubData: any) {
		let { name = '', avatarUrl, teamList = [] } = githubData;

		const logo: any = document.querySelector('.github-team-logo') || {};

		if (avatarUrl) {
			logo.src = avatarUrl;
		} else {
			logo.remove();
		}

		const teamNameEl: any = document.querySelector('.cohort-season-name');
		teamNameEl ? teamNameEl.innerHTML = name : null;

		console.log('teamList:', teamList);

		teamList.sort((a: any, b: any) => {
			const aName = a.name ? a.name.toLowerCase() : '';
			const bName = b.name ? b.name.toLowerCase() : '';

			if (aName > bName) { return 1 };
			if (aName < bName) { return -1 };
			return 0;
		});

		const metricsTeamsEl: any = document.querySelector('.metrics-teams');

		if (metricsTeamsEl) {
			metricsTeamsEl.innerHTML = teamList.length;
		}

		let teamChoices = teamList.map((team: any, index: number) => {
			const { name, id } = team;

			const classAttribute = index === 0 ? 'selected' : '';

			return `
				<li class="team-choice ${classAttribute}" data-id="${id}">${name}</li>
			`;
		}).join('').trim();

		let teamChoiceHtml = `
			<ul class="team-choice-list">${teamChoices}</ul>
		`;

		let teamHtml = teamList.map(this.createListItem).join('').trim();

		if (!teamList.length) {
			const noTeamsHtml = '<div class="no-team-choices">No Teams Available</div>';
			teamChoiceHtml = noTeamsHtml;
			teamHtml = noTeamsHtml;
		}

		this.showList(teamChoiceHtml, teamHtml);
	},

	createListItem(team: any, index: number) {
		let html = '';
		app.metricsMembersCount += team.members.totalCount;
		const discussions = team.discussions.nodes;

		const longDesc = app.getTeamLongDescription(discussions);
		const teamUpdate = app.getTeamUpdates(discussions);

		let longDescHtml = '';
		let teamUpdatePublishDate = 'No updates';
		let teamUpdateHtml = '';

		if (longDesc) {
			longDescHtml += `
				<div class="block-title">
					<span>Long Description:</span>
					<button class="btn long-desc-btn" data-id="${team.id}">View</button>
				</div>
				<div class="description-long hidden" data-id="${team.id}">
					${longDesc.bodyHTML}
				</div>
			`;
		}

		if (teamUpdate) {
			const referenceDate = teamUpdate.updatedAt || teamUpdate.publishedAt || '';

			teamUpdatePublishDate = new Date(referenceDate).toLocaleString();

			teamUpdateHtml += `
				<div class="team-update">
					<h4 class="team-update-title">${teamUpdate.title}</h4>
					${teamUpdate.bodyHTML}
				</div>
			`;
		}

		const memberList = team.members.nodes.map((member: any) => {
			const memberName = member.name ? ` (${member.name})` : '';
			return `
				<div>
					<a href="https://github.com/orgs/xapicohort/people/${member.login}" target="_blank">${member.login}${memberName}</a>
				</div>
			`;
		}).join('');

		html += `
			<section data-id="${team.id}" ${index === 0 ? 'class="selected"' : ''}>
				<h3><a target="_blank" href="${team.url}">${team.name}</a></h3>

				<div class="team-body">
					<p class="description-short">${team.description || '(No description)'}</p>

					<div class="team-data-block">
						${longDescHtml ? longDescHtml : '<div class="block-title">Long Description: <span class="block-title-value">None<span></div>'}
						
						<div class="block-title">
							<span>Members:</span>
							<span class="block-title-value">${team.members.totalCount}</span>
							<button class="btn member-list-btn" data-id="${team.id}">View</button>
						</div>
										
						<div class="member-list hidden" data-id="${team.id}">
							${memberList}
						</div>

						<div class="block-title">
							<span>Last Updated:</span>
							<span class="block-title-value">${teamUpdatePublishDate}</span>
						</div>
					</div>
					
					${teamUpdateHtml}

				</div>
			</section>
		`;

		return html;
	},

	showList(teamChoiceHtml: string, teamHtml: string) {
		const loader: any = document.querySelector('.page-loading');

		if (loader) {
			loader.classList.add('hidden');
		}

		const metricsMembersEl: any = document.querySelector('.metrics-members');

		if (metricsMembersEl) {
			metricsMembersEl.innerHTML = this.metricsMembersCount.toString();
		}

		const teamChoiceListEl: any = document.querySelector('.team-choice-list-wrapper');
		const teamListEl: any = document.querySelector('.team-list');

		if (teamChoiceListEl && teamListEl) {
			teamChoiceListEl.insertAdjacentHTML('beforeend', teamChoiceHtml);
			teamListEl.insertAdjacentHTML('beforeend', teamHtml);
		}

		app.bindTeamEvents();
	},

	bindTeamEvents() {
		document.addEventListener('click', function (e) {
			const { target }: any = e;
			const { classList } = target;
			const { id } = target.dataset;

			const isTeamChoice = classList.contains('team-choice');
			const isLongDescBtn = classList.contains('long-desc-btn');
			const isMemberListBtn = classList.contains('member-list-btn');
			const isViewSwitcher = classList.contains('view-switcher-btn');

			if (isTeamChoice) {
				const otherSelected = document.querySelectorAll('main .selected');
				const matchingSection = document.querySelector(`section[data-id="${id}"]`);

				otherSelected.forEach((other) => {
					other.classList.remove('selected');
				});

				classList.add('selected');

				if (matchingSection) {
					matchingSection.classList.add('selected');
				}
			}

			if (isLongDescBtn) {
				const longDescEl = document.querySelector(`.description-long[data-id="${id}"]`);

				if (longDescEl) {
					longDescEl.classList.toggle('hidden');
				}
			}

			if (isMemberListBtn) {
				const memberListEl = document.querySelector(`.member-list[data-id="${id}"]`);

				if (memberListEl) {
					memberListEl.classList.toggle('hidden');
				}
			}

			if (isViewSwitcher) {
				document.body.classList.toggle('long-list-display');
			}
		});
	},

	getTeamUpdates(discussions: any[]) {
		var discussionsSorted = discussions.sort(function (a, b) {
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


	getTeamLongDescription(discussions: any[]) {
		var longDesc = discussions.filter(function (disc) {
			return disc.isPinned;
		})[0];

		return longDesc;
	},

};

window.addEventListener('DOMContentLoaded', function () {
	app.init();
});