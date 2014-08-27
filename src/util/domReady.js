/**
 * Cross browser DOM ready function.
 * Hat tip to Dustin Diaz <dustindiaz.com> (MIT License)
 * https://github.com/ded/domready/tree/v0.3.0
 *
 * Will use jquery fallback for
 */
var domReady = function(ready) {

        var fns = [];
        var fn;
        var f = false;
        var doc = document;
        var testEl = doc.documentElement;
        var hack = testEl.doScroll;
        var domContentLoaded = "DOMContentLoaded";
        var addEventListener = "addEventListener";
        var onreadystatechange = "onreadystatechange";
        var readyState = "readyState";
        var loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/;
        var loaded = loadedRgx.test(doc[readyState]);

        function flush(f) {
            loaded = 1;
            while (f = fns.shift()) {
                f();
            }
        }

        doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
            doc.removeEventListener(domContentLoaded, fn, f);
            flush();
        }, f);
        hack && doc.attachEvent(onreadystatechange, fn = function () {
            if (/^c/.test(doc[readyState])) {
                doc.detachEvent(onreadystatechange, fn);
                flush();
            }
        });
        return (ready = hack ?
            function (fn) {
                self !== top ?
                    loaded ? fn() : fns.push(fn) :
                    function () {
                        try {
                            testEl.doScroll("left");
                        } catch (e) {
                            return setTimeout(function () {
                                ready(fn);
                            }, 50);
                        }
                        fn();
                    }();
            } :
            function (fn) {
                loaded ? fn() : fns.push(fn);
            });
    }();

