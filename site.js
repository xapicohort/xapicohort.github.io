var site = {
    init: function () {
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
    createNavbar: function () {
        var currentRoute = window.location.pathname.replace(/\//g, '');
        var navItems = this.navItems.map(function (item) {
            var itemRoute = item.href.replace(/\//g, '');
            var activeClass = currentRoute === itemRoute ? 'active' : '';
            return "\n\t\t\t\t<li class=\"nav-item\">\n\t\t\t\t\t<a class=\"nav-link text-center " + activeClass + "\" href=\"" + item.href + "\">" + item.text + "</a>\n\t\t\t\t</li>\t\t\t\n\t\t\t";
        }).join('');
        var html = "\n\t\t\t<nav class=\"navbar navbar-expand-md navbar-dark bg-primary\">\n\t\t\t\t<a class=\"navbar-brand abs\" href=\"/\">\n\t\t\t\t\t<span class=\"navbar-logo\"></span>\n\t\t\t\t\t<span class=\"text-white navbar-title\">xAPI Learning Cohort</span>\n\t\t\t\t</a>\n\t\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapsingNavbar\">\n\t\t\t\t\t<span class=\"navbar-toggler-icon\"></span>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"navbar-collapse collapse\" id=\"collapsingNavbar\">\n\t\t\t\t\t<ul class=\"navbar-nav\">\n\t\t\t\t\t\t" + navItems + "\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</nav>\n\t\t";
        var headerEl = document.querySelector('header');
        if (headerEl) {
            headerEl.insertAdjacentHTML('beforeend', html);
        }
        else {
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
    loadScriptSync: function (idx) {
        var _this = this;
        var script = this.bootstrapScripts[idx];
        var s = document.createElement('script');
        s.src = script.src;
        s.integrity = script.integrity;
        s.crossOrigin = 'anonymous';
        s.type = 'text/javascript';
        s.async = false;
        document.body.insertAdjacentElement('beforeend', s);
        s.onload = function () {
            if (idx < (_this.bootstrapScripts.length - 1)) {
                _this.loadScriptSync(idx + 1);
            }
        };
    },
    addBootstrapScripts: function () {
        this.scriptsLength = this.bootstrapScripts.length;
        this.loadScriptSync(0);
    },
};
document.addEventListener('DOMContentLoaded', function () {
    site.init();
});
//# sourceMappingURL=site.js.map