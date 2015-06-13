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

        return {
            selector: $(node).getPath(),
            nodeId: nodeId
        };
    }

    function logNode(node){
    	self.displayEntryPoint({
            vector: 'htmlAttribute',
            node: nodeToObject(node),   
            details: this,                 // the event (onclick...)
            code: $(node).attr(this),
            exploit: node.outerHTML.substring(0,100) // todo
        });
    }

    function findKeyword(keyword){
    	var matches =$('['+keyword+']');
    	Array.prototype.forEach.call(matches, logNode, keyword);
    }
  
 	function findHtmlAttributes(){
 		Array.prototype.forEach.call(blacklist, findKeyword);
 	}

    function getSelector(nodeId) {
        return $(nodeRegistry[nodeId]).getPath()
    }

    function getNode(nodeId) {
        return nodeRegistry[nodeId]
    }

   	self.extend({
   		findHtmlAttributes: findHtmlAttributes,
        getNode: getNode,
        getSelector: getSelector
    });

})(window.antiXSSExtension);