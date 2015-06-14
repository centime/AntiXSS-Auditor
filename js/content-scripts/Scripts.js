(function (self) {
    "use strict";
    //todo dynamically created script

    function logScript (script,code) {
        self.sendEntryPoint({
            vector: "passive",     
            source: (script.src || "inline script"),
            details: "Run 'analyze'",              // impact on the page
            code: code,
            exploit: encodeURIComponent(script.outerHTML)//.substring(0,100) // todo
        });
    }

    function getCode (script, cb){
        if ( !($(script).attr('src')) ) {

            cb(script, script.text);

        } else if ( script.src ) {
            $.ajax({
                    url: script.src,
                    success: function(c){
                        cb(script, c);
                    },
                    error: function(x,e) {
                        cb(script, "Error: "+e);
                    }
                }
            );            

        } else {
            cb(script, "Not found.");
        }
    }

    function findScripts(){
        Array.prototype.forEach.call($('script'), function(s){
            getCode(s, logScript)
        });
    }

   	self.extend({
   		findScripts: findScripts
    });

})(window.antiXSSExtension);