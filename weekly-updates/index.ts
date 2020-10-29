const updates = {
	seasons: [
		'fall-2020',
	],

	allSeasonData: [],

	async init() {
		try {
			const dataPromises = this.seasons.map((season: string) => {
				return this.getData(season);
			});

			this.allSeasonData = await Promise.all(dataPromises);

			this.createAllHtml();
		} catch (error) {
			console.error('error getting update data:', error);
		}
	},

	async getData(filename: string): Promise<any> {
		const updateData = await fetch(`${filename}.json`);

		return updateData.json();
	},

	createAllHtml() {
		console.log('this.allSeasonData:', this.allSeasonData);

		const allSeasonsHtml = this.allSeasonData.map((seasonBlock: any) => {
			const { season, year, months } = seasonBlock;

			const seasonName = `${season} ${year}`;

			const monthHmtl = months.map((month: any) => {
				const { name: monthName, dates } = month;

				const dateHtml = dates.map((date: any) => {
					const { day, week = '', emails, recordings, extras } = date;

					const emailHtml = this.createEmailsHtml(emails);
					const recordingsHtml = this.createRecordingsHtml(recordings);
					const extrasHtml = this.createExtrasHtml(extras);

					const dayHtml = `
						<div class="date-container">
							<h3>
								${week ? '<span class="week">Week ' + week + '</span> | ' : ''}
								<span class="date">${monthName} ${day}</span>
							</h3>
							<div class="link-container">
								${emailHtml}
								${recordingsHtml}
								${extrasHtml}
							</div>
						</div>
					`;

					return dayHtml;
				}).join('');

				return dateHtml;
			}).join('');

			return monthHmtl;
		}).join('');



		const containerEl = document.querySelector('.seasons-container');

		containerEl?.insertAdjacentHTML('afterbegin', allSeasonsHtml);

	},

	createEmailsHtml(emails: any[] = []) {
		return emails.map((email) => {
			const { title, link } = email;

			return this.createExternalLink(title, link, 'email');
		}).join('');
	},

	createRecordingsHtml(recordings: any[] = []) {
		return recordings.map((recording) => {
			const { title, link } = recording;

			const newTitle = title || 'Session Recording';

			return this.createExternalLink(newTitle, link, 'video');
		}).join('');

	},

	createExtrasHtml(extras: any[] = []) {
		return extras.map((extra) => {
			const { type, title, presenter, link } = extra;

			let newTitle = title;
			let linkType = '';

			if (type === 'slides') {
				newTitle = `${presenter} | ${title}`;
				linkType = type;
			}

			return this.createExternalLink(newTitle, link, linkType);
		}).join('');
	},

	createExternalLink(title: string, link: string, linkType?: string) {
		let icon = 'fas fa-external-link-alt';
		let titlePrefix = '';

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

		const fullTitle = titlePrefix ? `<span class="link-type">${titlePrefix}</span>${title}` : title;

		return `
			<a href="${link}" target="_blank">
				<i class="${icon}"></i>${fullTitle}
			</a>
		`;
	},
};

document.addEventListener('DOMContentLoaded', function () {
	updates.init();
});