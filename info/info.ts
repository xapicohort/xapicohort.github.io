declare var $: any;

const info = {
	query: {},

	init() {
		this.bindEvents();

		this.query = this.utils.parseQuery();

		const section = this.query.section;

		if (section) {
			const $navItem = $(`.left-nav a[href="#${section}"]`);
			$navItem.click();
		}

	},

	bindEvents() {
		$(document).on("scroll", this.onDocumentScroll);

		$('main a[href^="#"]').on('click', this.onNavSelect);
	},

	updateUrl(hash: string) {
		const queryStr = hash.replace('#', '');

		window.history.replaceState(null, queryStr, `?section=${queryStr}`);
	},

	onNavSelect(e: any) {
		e.preventDefault();
		$(document).off("scroll");

		$('.left-nav .nav-link').removeClass('active');

		$(this).addClass('active');

		const { hash } = this;
		const $target = $(hash);
		info.updateUrl(hash);

		// - 95
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top - 110
		}, 500, 'swing', function () {
			// window.location.hash = hash;
			$(document).on("scroll", info.onDocumentScroll);
		});
	},

	onDocumentScroll() {
		var scrollPos = $(document).scrollTop();
		scrollPos += 110;

		var $navLinks = $('.left-nav .nav-link');

		$navLinks.each(function () {
			var currLink = $(this);

			var refElement = $(currLink?.attr("href"));

			var refPos = refElement.position();
			var refTop = refPos.top || null;

			var refIsActive = (refTop <= scrollPos) && (refTop + refElement.height()) > scrollPos;

			if (refIsActive) {
				const { hash } = this;
				// window.location.hash = hash;
				info.updateUrl(hash);

				$navLinks.removeClass("active");
				currLink.addClass("active");
			}
			// else {
			// 	currLink.removeClass("active");
			// }
		});
	},

	utils: {
		parseQuery(queryParams?: string) {
			const query = {};
			let fullQuery;

			try {
				fullQuery = queryParams || window.location.search || window.location.href || '';
			} catch (error) {
				console.error('error getting querystring:', error);
				return query;
			}

			if (!fullQuery) { return query; }

			const queryString = fullQuery.split('?')[1];

			if (!queryString) { return query; };

			const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');

			pairs.forEach((pair) => {
				const thisPair = pair.split('=');
				query[decodeURIComponent(thisPair[0])] = decodeURIComponent(thisPair[1] || '');
			});

			return query;
		},

    debounce(func, wait, immediate) {
			var timeout;
			return function () {
				const context = this
					, args = arguments;
				const later = function () {
					timeout = null;
					if (!immediate)
						func.apply(context, args);
				};
				const callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow)
					func.apply(context, args);
			}
				;
		},
	},

};

// event dispatched from site.js
document.addEventListener('scripts-loaded', function () {
	info.init();
});
