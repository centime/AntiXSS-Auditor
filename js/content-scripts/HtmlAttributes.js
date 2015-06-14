(function (self) {
    "use strict";

    var blacklist = [
		'onload',
		'onclick',
		'onmouseover'
	];

    var nodeRegistry = [];

    function nodeToObject (node) {
        
        var nodeId = nodeRegistry.indexOf(node);

        if (nodeId === -1) {
            nodeRegistry.push(node);
            nodeId = nodeRegistry.length - 1;
        }

        return nodeId
    }

    function logNode(node){
    	self.sendEntryPoint({
            vector: this === "onload" ? "passive":"active", // todo onerror etc.
            source: $(node).getPath(),   
            details: this,                 // the event (onclick...)
            code: $(node).attr(this),
            exploit: encodeURIComponent(node.outerHTML), // todo
            nodeId: nodeToObject(node)
        });
    }

    function findKeyword(keyword){
    	var matches =$('['+keyword+']');
    	Array.prototype.forEach.call(matches, logNode, keyword);
    }
  
 	function findHtmlAttributes(){
 		Array.prototype.forEach.call(blacklist, findKeyword);
 	}

    function getNode(nodeId) {
        return nodeRegistry[nodeId]
    }

    self.extend({
        findHtmlAttributes: findHtmlAttributes,
        getNode: getNode
    });

})(window.antiXSSExtension);