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
        name: "content-script"
    });

    function displayEntryPoint(e) {
        bgPageConnection.postMessage({
            type: 'entryPoint',
            entryPoint: e
        });
    }

    function sendConnected(){
      bgPageConnection.postMessage({
          type: 'connected',
          url: document.location.href
      });
    }

    window.antiXSSExtension.extend({
        displayEntryPoint: displayEntryPoint,
        sendConnected: sendConnected,
    });

})();