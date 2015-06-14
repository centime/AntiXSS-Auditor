(function () {
    "use strict";

    function removeFrom(e){
        var index = this.indexOf(e);
        if (index > -1) {
            this.splice(index, 1);
        }
    }

    // Only accesses the selectors
    function DOMDiff(origin, crippled) {

        var removed = origin.slice() ; // copy by values
        Array.prototype.forEach.call( crippled, removeFrom, removed ) // No, filter doesn't work. It removes all occurencies

    	var diff;
        diff = {
            origin: origin,
            crippled: crippled,
            total: origin.length,
            removed: removed 
        };

        return diff
    }

    window.DOMDiff = DOMDiff;

})();
