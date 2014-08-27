
/**
 * Get an elements computed pixel width and height.
 *
 * @param elem
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
