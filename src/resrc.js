if(typeof BUILD_TYPE == 'undefined') var BUILD_TYPE = 'STANDALONE';

if(typeof resrc == 'undefined') var resrc = new (function ReSRC() {});


resrc.version = "0.8";

////////////////////////////////////////////////////////////////////////////
////   Default config options
////////////////////////////////////////////////////////////////////////////
var defaults ={
    server: "app.resrc.it",
    resrcClass: "resrc",
    resrcAttribute: "data-src",
    resrcOnResize: true,
    resrcOnResizeDown: true,
    resrcOnPinch: false,
    imageQuality: 85,
    pixelRounding: 10,
    ssl: false,
    corePlugin: true
};



var windowHasResizeEvent = false;
var windowResizeTimeout = 200;
var windowLastWidth = 0;


////////////////////////////////////////////////////////////////////////////
////   Utilities and polyfils
////////////////////////////////////////////////////////////////////////////

/**
 * These functions can be supplied by jQuery to reduce weight;
 */
var domReady,
    mergeObject,
    isArray,
    getElementsByClassName;


//    jQuery-supplied utilities and polyfills
//---------------------------------------------
if (BUILD_TYPE == 'JQUERY') {
    domReady = jQuery;
    mergeObject = jQuery.extend;
    isArray = jQuery.isArray;

    /**
     * Cross browser implementation of getElementsByClassName.
     * It may not be present in all browsers.
     * For example: Internet Explorer < 9.
     *
     * Modified to always return an Array object
     * Will use jquery as a fallback when building for jQuery
     *
     * @param className
     * @returns {Array}
     */
    getElementsByClassName = function(className){
        if(typeof document.getElementsByClassName !== 'undefined'){
            ret = Array.prototype.slice.apply(document.getElementsByClassName(className));
        } else {
            return $('.'+className).toArray();
        }
    }


//    Standalone utilities and polyfills
//---------------------------------------------
} else {

    /**
     * Cross browser DOM ready function.
     * Hat tip to Dustin Diaz <dustindiaz.com> (MIT License)
     * https://github.com/ded/domready/tree/v0.3.0
     *
     * Will use jquery fallback for
     */
    domReady = function (ready) {

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


    /**


    /**
     * Merge 2 objects together.
     *
     * @param  a {Object}  default object
     * @param  b {Object}  options object
     * @returns {object}
     */
    mergeObject = function (a, b) {
        if (a && b) {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
        }
        return a;
    };

    isArray = function (obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === "[object Array]"
    };


    /**
     * Cross browser implementation of getElementsByClassName.
     * It may not be present in all browsers.
     * For example: Internet Explorer < 9.
     *
     * Modified to always return an Array object
     * Will use jquery as a fallback when building for jQuery
     *
     * @param className
     * @returns {Array}
     */
    getElementsByClassName = function (className) {
        var ret = [];
        if (typeof document.getElementsByClassName !== "undefined") {
            ret = Array.prototype.slice.apply(document.getElementsByClassName(className));
        }
        else {
            if (BUILD_TYPE == 'JQUERY') {
                return jQuery('.' + className).toArray();
            } else {
                var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
                var elems = document.getElementsByTagName("*");
                for (var i = 0, len = elems.length; i < len; i++) {
                    if (elems[i].className.match(regex)) {
                        ret.push(elems[i]);
                    }
                }
            }
        }
        return ret;
    };


}
// End polyfill supplier split utilities
//------------------------





if (!Array.prototype.unique) {
    Array.prototype.unique = function () {
        for (var a = this.slice().sort(), b = [], c = a.length; c--; a[c] === a[c - 1] || b.push(a[c]));
        return b
    }
}




////////////////////////////////////////////////////////////////////////////
////   Configuration options
////////////////////////////////////////////////////////////////////////////
var options = resrc.options = mergeObject(defaults,(resrc.options||{}));



////////////////////////////////////////////////////////////////////////////
////   The Meat
////////////////////////////////////////////////////////////////////////////

/**
 * Split any well-formed URI into its parts.
 * Hat Tip to Steven Levithan <stevenlevithan.com> (MIT License)
 *
 * @param str {string}
 * @returns {object}
 */
var parseUri = function (str) {
    var o = {
        key: [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    };
    // Fix the parser not playing nice with the @ signs in URL's such as: http://example.com/@user123
    str = str.replace(/@/g, "%40");
    var m = o.parser.exec(str);
    var uri = {};
    var i = 14;
    while (i--) {
        uri[o.key[i]] = m[i] || "";
    }
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) {
            uri[o.q.name][$1] = $2;
        }
    });
    var fileSplt = uri.file.split(".");
    uri.filename = fileSplt[ 0 ];
    uri.ext = ( fileSplt.length > 1 ? fileSplt[ fileSplt.length - 1 ] : "" );
    return uri;
};


/**
 * Get the elements tag name in lowercase.
 * @param elem
 * @returns {string}
 */
var getTagName = function (elem) {
    return elem.tagName.toLowerCase();
};


/**
 * Get the url protocol based on the options.ssl value.
 *
 * @param [ssl] {boolean}
 * @returns {string}
 */
var getProtocol = function (ssl) {
    if (ssl === null) {
        ssl = options.ssl;
    }
    return ssl ? "https://" : "http://";
};


/**
 * Get the remote image URL (fallback URL).
 *
 * @param url {string}
 * @returns {string}
 */
var getRemoteImageURL = function (url) {
    var imgPath;
    var searchVal;
    var index;
    var res;
    var parsedUri = parseUri(url);
    imgPath = parsedUri.url ? parsedUri.path + "?" + parsedUri.query : parsedUri.path;
    searchVal = /(https?):|(\/\/)/;
    index = imgPath.search(searchVal);
    res = imgPath.substring(index);
    if (res.indexOf("://") === -1) {
        res = res.replace("//", getProtocol(options.ssl));
    }
    if (res.charAt(0) === "/") {
        res = res.replace("/", getProtocol(options.ssl));
    }
    return res;
};


/**
 * Get the resrc path prefix (The part that gets prepended onto the remote image).
 *
 * @param url {string}
 * @returns {string}
 */
var getResrcPathPrefix = function (url) {
    var imgPath;
    var searchVal;
    var index;
    var regexProtocol;
    var res;
    imgPath = url;
    searchVal = "//";
    regexProtocol = /\/(https?):/;
    index = imgPath.lastIndexOf(searchVal);
    res = imgPath.slice(0, index).replace(regexProtocol, "");
    return res;
};


/**
 * Parse the src to return a consistent format.
 *
 * 1. Does the url contain a "//" anywhere after the initial http(s)://?
 *    A. Does the image authority match the resrc server?
 *    B. If it doesn't replace it to match the resrc server.
 *
 * 2. Doesn't contain a "//" anywhere after the initial http(s)://
 *    A. create the url by adding the protocol, server and src together.
 *
 * @param src {string}
 * @param server {string}
 * @returns {string}
 */
var parseSrcToUniformFormat = function (src, server) {
    if (src.match(/\/\//g).length > 1) {
        var parsedUri = parseUri(src);
        return parsedUri.authority !== server ? src.replace(parsedUri.protocol + "://" + parsedUri.authority, getProtocol(options.ssl) + server) : src;
    }
    return getProtocol(options.ssl) + server + "/" + src;
};


/**
 * Does the string contain parenthesis?
 *
 * @param str {string}
 * @returns {boolean}
 */
var hasParenthesis = function (str) {
    var regExpParenthesis = /\((.*?)\)/g;
    return regExpParenthesis.test(str);
};


/**
 * Get the value inside the parenthesis.
 *
 * @param str {string}
 * @returns {string}
 */
var getValueInsideParenthesis = function (str) {
    var match;
    var arr = [];
    var regexParenthesis = /\((.*?)\)/g;
    while ((match = regexParenthesis.exec(str)) !== null) {
        arr.push(match[1].trim());
    }
    return arr.toString();
};


/**
 * Round the pixel size based on the pixel rounding parameter.
 * @param pixelSize {number}
 * @param pixelRounding {number}
 *
 * @returns {number}
 */
var pixelRound = function (pixelSize, pixelRounding) {
    return Math.ceil(pixelSize / pixelRounding) * pixelRounding;
};


/**
 * Does the user agent match a supported ResrcOnPinch device? (iPhone, iPod, iPad)
 *
 * @returns {boolean}
 */
var isSupportedResrcOnPinchDevice = function () {
    return (/iPhone|iPod|iPad/i).test(navigator.userAgent);
};


/**
 * Is the value a number?
 *
 * @param value {*}
 * @returns {boolean}
 */
var isNumber = function (value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
};


/**
 * Set a parameter and value.
 *
 * @param param {string}
 * @param val {string}
 * @returns {string}
 */
var setParameterAndValue = function (param, val) {
    if (hasParenthesis(val)) {
        return param + "=" + getValueInsideParenthesis(val);
    }
    return param + "=" + val;
};


/**
 * Get the final index position of a specified item from an array.
 *
 * @param arr {Array}
 * @param str {string}
 * @returns {number}
 */
var getFinalIndexPositionFromArray = function (arr, str) {
    var i = arr.length;
    while (i--) {
        if (str === "") {
            if (arr[i] === "") {
                return i;
            }
        } else {
            var p = new RegExp(str);
            var m = p.exec(arr[i]);
            if (m !== null) {
                return i;
            }
        }
    }
    return -1;
};


/**
 * Get the inner width of the screen.
 *
 * @returns {number}
 */
var getDeviceScreenInnerWidth = function () {
    var zoomMultiplier = Math.round((screen.width / window.innerWidth) * 10) / 10;
    return zoomMultiplier <= 1 ? 1 : zoomMultiplier;
};


/**
 * Get the pixel ratio specified on the element if it has a data-dpi attribute.
 * Fall back to the device pixel ratio.
 *
 * @param elem {HTMLElement}
 * @returns {Number}
 */
var getPixelRatio = function (elem) {
    var dpiOverride = elem.getAttribute("data-dpi");
    var devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var dpi = isNumber(dpiOverride) === true ? parseFloat(dpiOverride) : devicePixelRatio;
    if (dpi % 1 !== 0) {
        dpi = dpi.toFixed(1);
    }
    return dpi;
};


/**
 * Get the server specified on the element.
 * Fall back to the options.server.
 *
 * @param elem {HTMLElement}
 * @returns {string}
 */
var getServer = function (elem) {
    return elem.getAttribute("data-server") || options.server;
};


/**
 * Get the window width.
 *
 * @returns {number}
 */
var getWindowWidth = function () {
    if (BUILD_TYPE === "JQUERY") {
        return $(window).innerWidth();
    } else {
        return document.documentElement.clientWidth || document.body && document.body.clientWidth || 1024;
    }
};


/**
 * Get the window height.
 *
 * @returns {number}
 */
var getWindowHeight = function () {
    if (BUILD_TYPE === "JQUERY") {
        return $(window).innerHeight();
    } else {
        return document.documentElement.clientHeight || document.body && document.body.clientHeight || 768;
    }
};


/**
 * Get the elements image src.
 *
 * @param elem {HTMLElement}
 * @returns {string}
 */
var getImgSrc = function (elem) {
    return elem.getAttribute(options.resrcAttribute) || elem.getAttribute("src");
};


/**
 * Get the parameter.
 *
 * @param str {string}
 * @returns {string}
 */
var getParameter = function (str) {
    return str.split("=")[0];
};


/**
 * Get the parameter value.
 *
 * @param str {string}
 * @returns {string}
 */
var getParameterValue = function (str) {
    return str.split("=")[1];
};


/**
 * Get an elements computed pixel width and height.
 *
 * @param elem {HTMLElement}
 * @returns {object}
 */
var getComputedPixelSize = function (elem) {
    var val = {};
    val.width = elem.offsetWidth;
    val.height = elem.offsetHeight;
    if (elem.parentNode === null) {
        val.width = getWindowWidth();
        val.height = getWindowHeight();
        return val;
    }

    if (val.width !== 0 || val.height !== 0) {
        /**
         * 1 time hack for images with an alt and no src tag.
         * Example: <img data-src="img.jpg" alt="An Image"/>
         * Since the image has no parsable src yet, the browser actually reports the width of the alt text.
         * For example: 20px or whatever. F***ing Crazy I know, but does make sense! We return the parent nodes sizes instead.
         * 2nd time round we skip this and return the correct values.
         */
        if (elem.alt && !elem.resrc) {
            elem.resrc = true;
            return getComputedPixelSize(elem.parentNode);
        }
        return val;
    } else {
        var ret;
        var name;
        var old = {};
        var cssShow = { position: "absolute", visibility: "hidden", display: "block" };
        for (name in cssShow) {
            if (cssShow.hasOwnProperty(name)) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = cssShow[ name ];
            }
        }
        ret = val;
        for (name in cssShow) {
            if (cssShow.hasOwnProperty(name)) {
                elem.style[ name ] = old[ name ];
            }
        }
        if (ret.width === 0 || ret.height === 0) {
            return getComputedPixelSize(elem.parentNode);
        } else {
            return ret;
        }
    }
};


/**
 * Throttle function calls based on a period of time.
 *
 * @param func {Function}
 * @param wait {number}
 * @returns {function}
 */
var debounce = function (func, wait) {
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};


/**
 * Replace the elements image src when the elementPinched function is called.
 * This is used in the "gestureend" event listener callback.
 *
 * @returns void
 */
var elementPinched = function () {
    replaceElementSrc(this);
};


/**
 * Add "gestureend" event listener if supported.
 *
 * @param elem {HTMLElement}
 * @returns void
 */
var addGestureendEvent = function (elem) {
    if (elem.addEventListener && !elem.eventListenerAdded) {
        elem.addEventListener("gestureend", elementPinched, false);
        elem.eventListenerAdded = true;
    }
};


/**
 * Add "resize" window event.
 *
 * @returns void
 */
var addWindowResizeEvent = function () {
    if (window.addEventListener) {
        window.addEventListener("resize", windowResized, false);
    } else if (window.attachEvent) {
        window.attachEvent("onresize", windowResized);
    }
    windowHasResizeEvent = true;
};

/**
 * Reload resrc if the window width is different to last window width.
 * This is used in the "resize" event listener callback.
 *
 * @returns void
 */
var windowResized = function () {
    if (windowLastWidth !== getWindowWidth()) {
        resrcReload();
    }
};


/**
 * Initialize resrc and update the last window width variable.
 *
 * @returns void
 */
var resrcReload = debounce(function () {
    actualRunReSRC();
    windowLastWidth = getWindowWidth();
}, windowResizeTimeout);


/**
 * Create the ReSRC image object.
 *
 * @param elem {HTMLElement}
 * @returns {object}
 */
var getResrcImageObject = function (elem) {
    // Declare the final resrc image path.
    var resrcImgPath;
    // Declare an empty array to store the resrc api url params inside.
    var resrcParamArr = [];
    // Declare the dpi for the element.
    var dpi = getPixelRatio(elem);
    // Declare the pixel rounding value.
    var pixelRounding = options.pixelRounding;
    // Declare the screen zoom multiplier.
    var zoomMultiplier = isSupportedResrcOnPinchDevice() ? getDeviceScreenInnerWidth() : 1;
    // Declare the sizes of the element (width and height as an Object).
    var elementSizeObj = getComputedPixelSize(elem);
    // Declare the pixel width of the element.
    var elementPixelWidth = pixelRound(elementSizeObj.width * zoomMultiplier, pixelRounding);
    // Declare the pixel height of the element.
    var elementPixelHeight = pixelRound(elementSizeObj.height * zoomMultiplier, pixelRounding);
    // Declare the resrc server.
    var resrcServer = getServer(elem);
    // Declare the resrc full image path.
    var resrcPathFull = parseSrcToUniformFormat(getImgSrc(elem), resrcServer);
    // Declare the resrc path prefix.
    var resrcPathPrefix = getResrcPathPrefix(resrcPathFull);
    // Declare any existing resrc api params and make them lowercase.
    var resrcPathParams = parseUri(resrcPathPrefix).directory.toLowerCase().substring(1);
    // Declare the size param "s=". This value is either a width or a height depending which is larger.
    var resrcSizeParam = elementPixelHeight <= elementPixelWidth === true ? setParameterAndValue("s", "w" + elementPixelWidth + ",pd" + dpi) : setParameterAndValue("s", "h" + elementPixelHeight + ",pd" + dpi);
    // Declare the fallback image url.
    var fallbackImgURL = getRemoteImageURL(resrcPathFull);
    // [A.] If there are existing resrc api parameters in the url, then...
    if (resrcPathParams) {
        // Fill the empty resrc param array with the existing resrc api parameters.
        resrcParamArr = resrcPathParams.split("/");
        // Declare how many items are in the resrc param array.
        var j = resrcParamArr.length;
        // Loop backwards through the resrc param array.
        while (j--) {
            // Ensure we have the correct value for the resrc parameter. If the api param is key=val(val) get val inside parenthesis.
            resrcParamArr[j] = setParameterAndValue(getParameter(resrcParamArr[j]), getParameterValue(resrcParamArr[j]));
        }
        // Declare the final index position of the optimization "o=" parameter.
        var finalOParamIndexPosition = getFinalIndexPositionFromArray(resrcParamArr, "o=.*");
        // Declare the final index position of the crop "c=" parameter.
        var finalCParamIndexPosition = getFinalIndexPositionFromArray(resrcParamArr, "c=.*");
        // Declare the final index position of the size "s=" parameter.
        var finalSParamIndexPosition = getFinalIndexPositionFromArray(resrcParamArr, "s=.*");
        // Step 1: If there is an "o" param, then...
        if (finalOParamIndexPosition !== -1) {
            // Move it to the end of the resrc param array.
            resrcParamArr.splice(finalOParamIndexPosition, 1, resrcParamArr[finalOParamIndexPosition]);
        }
        else {
            // There is no "o" param, so add one to the end of the resrc param array.
            resrcParamArr.push(setParameterAndValue("o", options.imageQuality));
        }
        // Step 2: If there is an "s" param, then...
        if (finalSParamIndexPosition !== -1) {
            // Step 2.1: Check if there is a "c" param. If there is, then...
            if (finalCParamIndexPosition !== -1) {
                // Add the resrc size param to the 2nd to last position in the resrc param array.
                // This is so we don't move/remove any existing sizes params that are dependent on crop params.
                resrcParamArr.splice(-1, 0, resrcSizeParam);
            }
            else {
                // Replace the last "s" param with the new resrc size param.
                resrcParamArr.splice(finalSParamIndexPosition, 1, resrcSizeParam);
            }
        }
        else {
            // There is no "s" param, therefore add the resrc size param to the 2nd to last position in the resrc param array.
            resrcParamArr.splice(-1, 0, resrcSizeParam);
        }
    }
    else {
        // [B.] There are no existing resrc api parameters in the url, so...
        // Add the resrc size param to the resrc param array.
        resrcParamArr.push(resrcSizeParam);
        // Add the resrc optimization parameter to the resrc param array.
        resrcParamArr.push(setParameterAndValue("o", options.imageQuality));
    }
    // set the resrcPathParams to be a string of the resrc param array, joined together using an "/" sign as the separator.
    resrcPathParams = resrcParamArr.join("/");
    // Set the final resrc image path.
    resrcImgPath = getProtocol(options.ssl) + resrcServer + "/" + resrcPathParams + "/" + fallbackImgURL;

    // Return the resrc image object.
    var resrcObj = {
        resrcImgPath: resrcImgPath,
        fallbackImgPath: fallbackImgURL,
        width: elementPixelWidth,
        height: elementPixelHeight,
        params: resrcPathParams,
        server: resrcServer,
        protocol: getProtocol()
    };


    var modifiers = hookFunctions.get("modifyResrcObject");
    for (var k = 0; k < modifiers.length; k++) {
        resrcObj = modifiers[k](elem, resrcObj);
    }

    return resrcObj;
};


/**
 * Replace the image source of the element.
 *
 * @param elem {HTMLElement}
 * @returns void
 */
var replaceElementSrc = function (elem) {

    // Declare the resrc image object.
    var resrcObj = getResrcImageObject(elem);

    // Compile the full path to image
    resrcObj.resrcImgPath = resrcObj.protocol + resrcObj.server + "/" + resrcObj.params + "/" + resrcObj.fallbackImgPath;

    var elementModifiers = hookFunctions.get("modifyElement");
    for (var k = 0; k < elementModifiers.length; k++) {
        elementModifiers[k](elem, resrcObj);
    }

};


/**
 * The ACTUAL runtime script, called in the scope of a group to do its thang
 *
 * @param [elem] {null|HTMLElement|Array<HTMLElement>}
 * @returns void
 */
var actualRunReSRC = function (elem) {
    // Declare the elemArr.
    var elemArr;
    // If the elem param is not an array then make it so.
    if (elem) {
        elemArr = isArray(elem) ? elem : [elem];
    }
    // If no elem param is set, then gather elements manually
    else {
        elemArr = [];
        // Allow plugins to extend the elements list
        var hookFns = hookFunctions.get("getElements");
        for (var k = 0; k < hookFns.length; k++) {
            var newEls = hookFns[k].apply(this);
            if (newEls) {
                elemArr = elemArr.concat(newEls);
            }
        }
    }

    // Remove any duplicates
    elemArr = elemArr.unique();


    // Loop through the elemArr.
    for (var i = 0; i < elemArr.length; i++) {
        // If the resrcOnPinch option is set to true add the "gestureend" event listener to the element.
        if (options.resrcOnPinch) {
            addGestureendEvent(elemArr[i]);
        }
        // replace the element image source.
        replaceElementSrc(elemArr[i]);
    }

    // Finally add the window resize event if the resrcOnResize option is set to true.
    if (options.resrcOnResize && !windowHasResizeEvent) {
        addWindowResizeEvent();
    }

};


/**
 * Wrapper function to make sure the main script is only
 * run AFTER the DOMReady event
 *
 * @returns void
 */
var runReSRC = function () {
    domReady(function () {
        console.log('ready');
        actualRunReSRC();
    });
};


////////////////////////////////////////////////////////////////////////////
////   Plugin hook utilities
////////////////////////////////////////////////////////////////////////////
var hookFunctions = {
    fns: {},
    add: function (hook, fn) {
        this.fns[hook] || (this.fns[hook] = []);
        this.fns[hook].push(fn);
    },
    get: function (hook) {
        return this.fns[hook] || [];
    }
};


var registerPlugin = function (name, pluginFn) {

    resrc[name] = function (options) {
        pluginFn(options)
        return resrc;
    }
};

var applyHooks = function (methods) {
    for (var hook in methods) {
        var fn = methods[hook];
        hookFunctions.add(hook, fn);
    }
};


resrc.plugin = {
    register: registerPlugin,
    hook: applyHooks
};


////////////////////////////////////////////////////////////////////////////
////   Eat your own dogfood
////////////////////////////////////////////////////////////////////////////

applyHooks({

    getElements: function () {
        return getElementsByClassName(options.resrcClass);
    },


    modifyElement: function (elem, resrcObj) {

        var resrcImgPath = resrcObj.resrcImgPath;

        // Declare the fallback image path.
        var fallbackImgPath = resrcObj.fallbackImgPath;

        // Declare the current width of the element.
        var currentElemWidth = resrcObj.width;

        // Set the last width of the element.
        elem.lastWidth = elem.lastWidth || 0;

        // If the resrcOnResizeDown option is is set to false, then...
        if (options.resrcOnResizeDown === false) {
            // Return if the last width of the element is >= to the current width.
            if (elem.lastWidth >= currentElemWidth) {
                return;
            }
        }

        // If element is an image tag, then...
        if (getTagName(elem) === "img") {
            // Set the src of the element to be the resrc image path.
            elem.src = resrcImgPath;
            // If there is an error set the src of the element to the fallback image path.
            elem.onerror = function () {
                this.src = fallbackImgPath;
            };
        }
        else {
            // Declare a new image object.
            var img = new Image();
            // Set the image objects src to the resrc image path.
            img.src = resrcImgPath;
            // Set the css background image style of the element to be the resrc image path.
            elem.style.backgroundImage = "url(" + resrcImgPath + ")";
            // If there is an error set the css background image style of the element to be the fallback image path.
            img.onerror = function () {
                elem.style.backgroundImage = "url(" + fallbackImgPath + ")";
            };
        }
        // Set the elements last width = to the current width.
        elem.lastWidth = currentElemWidth;

    }

});


////////////////////////////////////////////////////////////////////////////
////   Setup the export object
////////////////////////////////////////////////////////////////////////////

resrc.it = resrc.resrc = resrc.run = runReSRC;

resrc.configure = function (opts) {
    options = mergeObject(options, opts);
};

resrc.util = {
    merge: mergeObject,
    getResrcImageObject: getResrcImageObject
};






