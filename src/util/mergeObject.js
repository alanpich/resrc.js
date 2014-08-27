/**
 * Merge 2 objects together.
 *
 * @param  a {Object}  default object
 * @param  b {Object}  options object
 * @returns {object}
 */
var mergeObject = function (a, b) {
        if (a && b) {
            for (var key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
        }
        return a;
};
