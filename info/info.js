var info = {
    query: {},
    init: function () {
        this.bindEvents();
        this.query = this.utils.parseQuery();
        var section = this.query.section;
        if (section) {
            var $navItem = $(".left-nav a[href=\"#" + section + "\"]");
            $navItem.click();
        }
    },
    bindEvents: function () {
        $(document).on("scroll", this.onDocumentScroll);
        $('main a[href^="#"]').on('click', this.onNavSelect);
    },
    updateUrl: function (hash) {
        var queryStr = hash.replace('#', '');
        window.history.replaceState(null, queryStr, "?section=" + queryStr);
    },
    onNavSelect: function (e) {
        e.preventDefault();
        $(document).off("scroll");
        $('.left-nav .nav-link').removeClass('active');
        $(this).addClass('active');
        var hash = this.hash;
        var $target = $(hash);
        info.updateUrl(hash);
        // - 95
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 110
        }, 500, 'swing', function () {
            // window.location.hash = hash;
            $(document).on("scroll", info.onDocumentScroll);
        });
    },
    onDocumentScroll: function () {
        var scrollPos = $(document).scrollTop();
        scrollPos += 110;
        var $navLinks = $('.left-nav .nav-link');
        $navLinks.each(function () {
            var _a;
            var currLink = $(this);
            var refElement = $((_a = currLink) === null || _a === void 0 ? void 0 : _a.attr("href"));
            var refPos = refElement.position();
            var refTop = refPos.top || null;
            var refIsActive = (refTop <= scrollPos) && (refTop + refElement.height()) > scrollPos;
            if (refIsActive) {
                var hash = this.hash;
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
        parseQuery: function (queryParams) {
            var query = {};
            var fullQuery;
            try {
                fullQuery = queryParams || window.location.search || window.location.href || '';
            }
            catch (error) {
                console.error('error getting querystring:', error);
                return query;
            }
            if (!fullQuery) {
                return query;
            }
            var queryString = fullQuery.split('?')[1];
            if (!queryString) {
                return query;
            }
            ;
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            pairs.forEach(function (pair) {
                var thisPair = pair.split('=');
                query[decodeURIComponent(thisPair[0])] = decodeURIComponent(thisPair[1] || '');
            });
            return query;
        },
        debounce: function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate)
                        func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow)
                    func.apply(context, args);
            };
        },
    },
};
// event dispatched from site.js
document.addEventListener('scripts-loaded', function () {
    info.init();
});
//# sourceMappingURL=info.js.map