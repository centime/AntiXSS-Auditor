(function () {
    "use strict";

    window.antiXSSExtension = window.antiXSSExtension || {} ;

    window.antiXSSExtension.extend = function(obj) {
       for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
             this[i] = obj[i];
          }
       }
    };

    var bgPageConnection = chrome.runtime.connect({
        name: "analyze"
    });

    function sendDOM(DOM) {
        bgPageConnection.postMessage({
            type: 'DOM',
            DOM: DOM
        });
    }


    window.antiXSSExtension.extend({
        sendDOM: sendDOM
    });

})();