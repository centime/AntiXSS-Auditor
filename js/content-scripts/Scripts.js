(function (self) {
    "use strict";
    //todo dynamically created script

    function type (script) {
        return $(script).attr('src') ? 'external' : 'inline'
    }

    function logScript (script,code) {
        self.displayEntryPoint({
            vector: type(script),     // external or inline
            details: "todo: 5%",              // impact on the page
            code: code,
            src: (script.src || "")
        });
    }

    function getCode (script, cb){
        if ( type(script) === 'inline' ) {

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