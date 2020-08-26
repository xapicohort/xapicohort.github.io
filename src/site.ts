const site = {
	init() {
		this.createNavbar();
		this.addBootstrapScripts();
	},

	navItems: [
		{
			text: 'Home',
			href: '/',
		},

		// {
		// 	text: 'Videos',
		// 	href: '/videos',
		// },

		{
			text: 'GitHub Teams',
			href: '/teams',
		},

		{
			text: 'xAPI Party',
			href: '/xapi-party',
		}
	],

	createNavbar() {
		const currentRoute = window.location.pathname.replace(/\//g, '');

		const navItems = this.navItems.map((item: any) => {
			const itemRoute = item.href.replace(/\//g, '');

			const activeClass = currentRoute === itemRoute ? 'active' : '';
			
			return `
				<li class="nav-item">
					<a class="nav-link text-center ${activeClass}" href="${item.href}">${item.text}</a>
				</li>			
			`;
		}).join('');

		const html = `
			<nav class="navbar navbar-expand-md navbar-dark bg-primary">
				<a class="navbar-brand abs" href="/">
					<span class="navbar-logo"></span>
					<span class="text-white navbar-title">xAPI Learning Cohort</span>
				</a>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="navbar-collapse collapse" id="collapsingNavbar">
					<ul class="navbar-nav">
						${navItems}
					</ul>
				</div>
			</nav>
		`;

		const headerEl = document.querySelector('header');

		if (headerEl) {
			headerEl.insertAdjacentHTML('beforeend', html);
		} else {
			console.warn('No header element to add navbar');
		}
	},

	bootstrapScripts: [
		{
			src: '//code.jquery.com/jquery-3.3.1.slim.min.js',
			integrity: 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo',
		},

		{
			src: '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
			integrity: 'sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1',
		},

		{
			src: '//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
			integrity: 'sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM',
		},
	],

	scriptsLength: 0,

	loadScriptSync(idx: number) {
		const script = this.bootstrapScripts[idx];
		const s = document.createElement('script');

		s.src = script.src;
		s.integrity = script.integrity;
		s.crossOrigin = 'anonymous';
		s.type = 'text/javascript';
		s.async = false;

		document.body.insertAdjacentElement('beforeend', s);

		s.onload = () => {
			if (idx < (this.bootstrapScripts.length - 1)) {
				this.loadScriptSync(idx + 1);
			}
		};
	},

	addBootstrapScripts() {
		this.scriptsLength = this.bootstrapScripts.length;

		this.loadScriptSync(0);
	},

};

document.addEventListener('DOMContentLoaded', function () {
	site.init();
});
