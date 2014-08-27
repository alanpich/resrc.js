
    /**
     * Get the elements tag name in lowercase.
     * @param elem
     * @returns {string}
     */
    var getTagName = function (elem) {
        return elem.tagName.toLowerCase();
    };


    applyHooks({

        getElements: function(){
            return getElementsByClassName(options.resrcClass);
        },


        modifyElement: function(elem,resrcObj){

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


