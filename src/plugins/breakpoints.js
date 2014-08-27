(function (resrc) {

    /**
     * Get the window width.
     * @returns {number}
     */
    var windowWidth;
    var getWindowWidth = function () {
        return document.documentElement.clientWidth || document.body && document.body.clientWidth || 1024;
    };

    function updateWindowWidth() {
        windowWidth = getWindowWidth();
    }

    if (window.addEventListener) {
        window.addEventListener("resize", updateWindowWidth, false);
    } else if (window.attachEvent) {
        window.attachEvent("onresize", updateWindowWidth);
    }
    updateWindowWidth();


    /**
     *
     */
    resrc.plugin.register('breakpoints', function (options) {

        options = resrc.util.merge({
            suffixPattern: "-breakpoint-([0-9]+)px"
        }, options);


        /**
         *
         * @returns {RegExp}
         */
        var getAttributeRegex = function () {
            return new RegExp(resrc.options.resrcAttribute + options.suffixPattern, "g");
        };


        /**
         *
         * @param elem
         * @returns {{}}
         */
        var getElementBreakpointAttributes = function (elem) {
            var regex = getAttributeRegex(),
                matches = {};

            for (var k = 0; k < elem.attributes.length; k++) {
                var attr = elem.attributes[k].nodeName;
                if (attr.match(regex)) {
                    // Extract width value
                    var widthMatches = regex.exec(attr),
                        maxWidth = parseInt(widthMatches[1]);

                    matches[maxWidth] = attr;
                }
            }
            return matches;
        };


        /**
         * Returns the closest value in arr that is less than targetValue
         *
         * @param arr  {Array<number>}  Array of numbers to check
         * @param targetValue {number}  The number we want to be close to
         * @returns {number}
         */
        var closestLesserValue = function index(attributeList, targetValue) { // binary search, with custom compare function
            var currentClosest = 999999;
            for (var key in attributeList) {
                if (!attributeList.hasOwnProperty(key)) continue;
                var n = parseInt(key);
                if (n >= targetValue && n < currentClosest) {
                    currentClosest = n;
                }
            }
            return currentClosest;
        };


        /**
         *
         * @param attributeList
         * @returns {Array}
         */
        var getBreakpointWidths = function (attributeList) {
            var nums = [];
            for (key in attributeList) {
                if (attributeList.hasOwnProperty(key)) {
                    nums.push(parseInt(key));
                }
            }
            return nums.sort();
        };


        /**
         *
         */
        resrc.plugin.hook({

            modifyResrcObject: function (elem, resrcObj) {

                var regex = getAttributeRegex(),
                    attrs = getElementBreakpointAttributes(elem),
                    breakpoints = {};

                var currentBP = 9999999999999,
                    breakpointToUse;

                // Extract pixel widths from attribute names
                var closestBP = closestLesserValue(attrs, windowWidth);


                if (attrs[closestBP]) {
                    resrcObj.fallbackImgPath = elem.getAttribute(attrs[closestBP]);
                }

                return resrcObj;


            }

        })

    })


})(resrc);
