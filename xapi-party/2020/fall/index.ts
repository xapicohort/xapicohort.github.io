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

	getRecordingUrlOrEmbed(session: any, type: string): any {
		const displayKey = type + '.display';
		const urlKey = type + '.url';
		const embedKey = type + '.embed';

		const display = session[displayKey];

		const noLinkData = !(display || urlKey || embedKey);

		if (noLinkData) { return null; }

		const url = session[urlKey];
		const embed = session[embedKey];

		const isSessionRecording = url && display === 'Session Recording';
		const isEmbed = embed && display === 'Embed';

		if (!isSessionRecording && !isEmbed) {
			return null;
		}

		// NOTE: Direct URLs turned off for Fall 2020, since all recordings are existing Kaltura iframe embeds
		if (isSessionRecording) {
			return null;
		}

		return {
			type: isSessionRecording ? 'url' : isEmbed ? 'embed' : '',
			src: isSessionRecording ? url : isEmbed ? embed : '',
		};
	},

	getRecordingEmbedHtml(urlOrEmbed: any, title: string = '', names: string = ''): string {
		const { type, src } = urlOrEmbed;

		let iframeHtml = '';

		if (type === 'url') {
			iframeHtml = `<iframe src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
		} else if (type === 'embed') {
			iframeHtml = src;
		}

		const embedHtml = `
			<div class="embed-container">
				<div>
					<h3 class="session-recording-title">${title}</h3>
					<div class="session-recording-names">${names}</div>
				</div>
				${iframeHtml}
			</div>
		`;

		return embedHtml;
	},

	async populateSessionRecordings() {
		const sessionData = await this.getData();

		if (!sessionData) { return; }

		const recordingsHtml = sessionData
			.filter((sessionBlock: any) => {
				const { data: session } = sessionBlock;

				const recordings: string[] = [];

				for (let i = 1; i <= 3; i++) {
					const urlOrEmbed = this.getRecordingUrlOrEmbed(session[0], `link${i}`);

					if (urlOrEmbed) {
						recordings.push(urlOrEmbed);
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
					.map((urlOrEmbed: any) => {
						if (urlOrEmbed) {
							return this.getRecordingEmbedHtml(urlOrEmbed, title, names);
						}
					})
					.filter((rec: any) => { return rec; })
					.join('');
			})
			.join('') || 'Recordings will be added as they are generated.';


		const recordingsEl = document.querySelector('.session-recordings-container');

		recordingsEl?.insertAdjacentHTML('beforeend', recordingsHtml);

	},

};

document.addEventListener('DOMContentLoaded', app.init.bind(app));