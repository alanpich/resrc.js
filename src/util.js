/**
 * This is a collection of utility methods that get wrapped into resrc's context
 *
 */



if(typeof BUILD_TYPE === 'undefined') BUILD_TYPE = false;

if(BUILD_TYPE == 'JQUERY'){
    var domReady = jQuery;
    var mergeObject = jQuery.extend;
    var isArray = jQuery.isArray;
    var getComputedPixelSize = function(elem){
        return $(elem).outerWidth()
    }
}

if(BUILD_TYPE == 'STANDALONE'){
    // @include './util/domReady.js'
    // @include './util/mergeObject.js'
    // @include './util/getComputedPixelSize.js'
    var isArray = function(obj){
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === "[object Array]"
    };
}

/**
 * Cross browser implementation of getElementsByClassName.
 * It may not be present in all browsers.
 * For example: Internet Explorer < 9.
 *
 * Modified to always return an Array object
 * Will use jquery as a fallback when building for jQuery
 *
 * @param className
 * @returns {Array|NodeList}
 */
var getElementsByClassName = function (className) {
    var ret = [];
    if (typeof document.getElementsByClassName !== "undefined") {
        ret = Array.prototype.slice.apply(document.getElementsByClassName(className));
    }
    else {
        if(BUILD_JQUERY){
            return jQuery('.'+className).toArray();
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



if(!Array.prototype.unique){
    Array.prototype.unique=function(){for(var a=this.slice().sort(),b=[],c=a.length;c--;a[c]===a[c-1]||b.push(a[c]));return b}
}
