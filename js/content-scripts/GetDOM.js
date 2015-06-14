(function (self) {
    "use strict";

    var DOM = $('*').toArray().map(function(e){
		return $(e).getPath()
	});
 
    self.sendDOM(DOM) ;

})(window.antiXSSExtension);
