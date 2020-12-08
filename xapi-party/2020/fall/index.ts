const app = {
	init() {
		this.populateSessionRecordings();
	},

	async getData() {
		let data;

		const filePath = '//s3.us-east-2.amazonaws.com/torrancelearning/internal/web/events/xapi-party.json';

		try {
			const response = await fetch(filePath);

			data = response.json();
		} catch (error) {
			console.error('error getting data:', error);
		}

		return data;
	},

	getRecordingUrl(session: any, type: string): string {
		const displayKey = type + '.display';
		const urlKey = type + '.url';

		// TODO: turn off fallback for real sessions
		const display = session[displayKey] || 'Session Recording';
		const url = session[urlKey] || 'https://www.youtube.com/embed/ScMzIvxBSi4';

		const isSessionRecording = display === 'Session Recording';

		const random = Math.random();

		if (random > 0.25) {
			return '';
		}

		if (isSessionRecording && url) {
			return url;
		} else {
			return '';
		}
	},

	getRecordingEmbedHtml(url: string, title: string = '', names: string = ''): string {
		const embedHtml = `
			<div class="embed-container">
				<div>
					<h3 class="session-recording-title">${title}</h3>
					<div class="session-recording-names">${names}</div>
				</div>
				<iframe src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
		`;
// width="360" height="240"
		return embedHtml;
	},

	async populateSessionRecordings() {
		const sessionData = await this.getData();

		if (!sessionData) { return; }

		const recordingsHtml = sessionData
			.filter((sessionBlock: any) => {
				const { data: session } = sessionBlock;

				const recordings: string[] = [];

				for (let i = 1; i <= 2; i++) {
					const thisLink = this.getRecordingUrl(session, `link${i}`);

					if (thisLink) {
						recordings.push(thisLink);
					}
				}
				
				if (recordings.length) {
					session[0].recordings = recordings;
					return true;
				}

			})
			.map((sessionBlock: any) => {
				const { data: session } = sessionBlock;
				const sessionData = session[0] || [];
				const { title, names, recordings } = sessionData;

				return recordings
					.map((url: string) => {
						if (url) {
							return this.getRecordingEmbedHtml(url, title, names);
						}
					})
					.filter((rec: any) => { return rec; })
					.join('');
			})
			.join('') || 'Recordings will be added as they are generated.';


		const recordingsEl = document.querySelector('.session-recordings-container');

		recordingsEl?.insertAdjacentHTML('afterend', recordingsHtml);

	},

};

document.addEventListener('DOMContentLoaded', app.init.bind(app));