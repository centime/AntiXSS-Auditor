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
            vector: 'eventElement',
            node: nodeToObject(node),
            type: this,
            code: $(node).attr(this)
        });
    }

    function findKeyword(keyword){
    	var matches =$('['+keyword+']');
    	Array.prototype.forEach.call(matches, logNode, keyword);
    }
  
 	function findEventElements(){
 		Array.prototype.forEach.call(blacklist, findKeyword);
 	}

    function getSelector(nodeId) {
        return $(nodeRegistry[nodeId]).getPath()
    }

    function getNode(nodeId) {
        return nodeRegistry[nodeId]
    }

   	self.extend({
   		findEventElements: findEventElements,
        getNode: getNode,
        getSelector: getSelector
    });

})(window.antiXSSExtension);