(function () {

    'use strict';

    var el = function (selector, container) { return (container || document).querySelectorAll(selector); };
    /**
     * Versions below 1.1.0 generated documentation
     * in /{browser,server}/index.html.
     *
     * Starting from version 1.1.0, documentation is generated
     * under /browser/{core,just}/index.html and server/index.html.
     */
    var isVersionBelow1Dot2 = function (version) { return /^1\.[01]\./.test(version); };
    var versions = el('#versions')[0];
    var bundles = el('#bundles')[0];
    var location = window.location;
    var urlParts = location.pathname.match(/\/v([^.]+\.[^.]\.[^\/]+)\/(browser|server)/) || [];
    var activeVersion = urlParts[1];
    var activeBundle = urlParts[2];

    versions.addEventListener('change', function (e) {

        var version = this.value;
        var pathname = location.pathname;
        var newUrl = (isVersionBelow1Dot2(version)
            // Redirect to the full version.
            ? pathname.replace(/(browser)\/just/, '$1')
            // Use as it is.
            : pathname
        ).replace(/v[^\/]+/, 'v' + version);

        location.href = newUrl;

    });

    bundles.addEventListener('change', function (e) {

        var bundle = this.value;
        var pathname = location.pathname;
        var newUrl = pathname
            // This will redirect browser -> server or viceversa.
            .replace(/(browser|server)/, bundle)
            // This will change (invalid) server/just -> server
            .replace(/(server)\/just/, '$1');

        if (!isVersionBelow1Dot2(activeVersion)) {

            // This will change browser/ & browser/just/ -> browser/just/
            newUrl = newUrl.replace(/(browser)\/(?:just\/)?/, '$1/just/');

        }

        location.href = newUrl;

    });

})();
