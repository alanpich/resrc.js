(function(resrc){
    if(typeof BUILD_TYPE == 'undefined') var BUILD_TYPE = false;


    /**
     * Cross-browser polyfill for Array detection
     *
     * @param obj {*}  The object to check
     * @returns {Boolean}
     */
    function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === "[object Array]";
    }


    /**
     * Browser fill for hasAttribute
     * @param node {HTMLElement}
     * @param attr {String}
     * @returns {boolean}
     */
    function hasAttribute(node,attr) {
        return node.hasAttribute ? node.hasAttribute(attr) : !!node.getAttribute(attr);
    }


    function getAttribute(ele, attr) {
        var result = (ele.getAttribute && ele.getAttribute(attr)) || null;
        if( !result ) {
            var attrs = ele.attributes;
            var length = attrs.length;
            for(var i = 0; i < length; i++){
                if(attr[i].nodeName === attr){
                    result = attr[i].nodeValue;
                }
            }
        }
        return result;
    }


    function setAttribute(el,attr,value){
        el.setAttribute(attr,value);
    }



    function appendAfter(newEl,existingEl){
        if (existingEl.nextSibling) {
            existingEl.parentNode.insertBefore(newEl, existingEl.nextSibling);
        }
        else {
            existingEl.parentNode.appendChild(newEl);
        }
    }


    function removeEl(el){
        el.parentNode.removeChild(el);
    }


    var fireDOMevent = function(element,eventName){
        var event; // The custom event that will be created

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(eventName, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = eventName;
        }

        event.eventName = eventName;

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    }



    function fireEvent(el,event){
        var evt;
        if (document.createEventObject){
            // dispatch for IE
            evt = document.createEventObject();
            return el.fireEvent('on'+event,evt)
        } else {
            // dispatch for fierefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !el.dispatchEvent(evt);
        }
    }





    resrc.plugin.register('modifyAttributes',function(options){

        // Allow passing a straight-up array of attributes as options
        if(isArray(options)){
            options = {
                attributes: options
            };
        }

        // Extend default values with runtime options
        options = resrc.util.merge({
            attributes: [],
            fallbackSuffix: '-fallback'
        },options);


        // Hook into the runtime
        resrc.plugin.hook({

            getElements: function(){
                // Find all elements in page with attribute
                var attributeQuery = "["+options.attributes.join("],[") + "]";
                var elems = document.querySelectorAll(attributeQuery);
                return Array.prototype.slice.apply(elems);
            },


            modifyElement: function(el,resrcObject){

                var hasDoneAnything = false;

                // Loop through all attributes
                for(var i=0;i<options.attributes.length;i++){
                    var attr = options.attributes[i],
                        hasChanged = false;

                    if(hasAttribute(el,attr)){
                        // Grab the current URL
                        var url = getAttribute(el,attr);


                        // Stash the old url in a new attribute (if not already done)
                        var stashAttribute = attr + options.fallbackSuffix;
                        if(!hasAttribute(el,stashAttribute)){
                            setAttribute(el,stashAttribute,url);
                        }

                        // Prepare it for resrcing
                        var dummyImg = document.createElement("img");
                            dummyImg.style.visibility = 'none';
                            dummyImg.style.position = 'absolute';
                            dummyImg.style.top = '-10000px';
                            el.parentNode.insertBefore
                            appendAfter(dummyImg,el);
                        setAttribute(dummyImg,"data-src",url);
                        var newResrcObject = resrc.util.getResrcImageObject(dummyImg);
                        removeEl(dummyImg);

                        // Replace url with the new value
                        var newUrl = newResrcObject.resrcImgPath;
                        if(newUrl != url){
                            setAttribute(el,attr,newUrl);
                            hasDoneAnything = true;
                            if(options.onChange && typeof options.onChange == 'function'){
                                options.onChange(el);
                            }
                        }
                    }
                }

                if(hasDoneAnything){
                    fireEvent(el,'resrc:modifyAttributes:change');
                }

            }

        })


    })




})(resrc);
