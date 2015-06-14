(function (self) {
    "use strict";

    function colorNode(node, color){
        color = color || {r: 51, g: 195, b: 240};

        if (node && node.nodeName === '#text') {
            highlightNode(node.parentNode, color);
        } else if (node && node.style) {
            node.style.boxShadow = '0 0 0 5px rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 1)'
        }
    }

    function blinkNode(node, duration, color) {
        duration = duration || 1800;
        color = color || {r: 240, g: 51, b: 144};

        if (node && node.nodeName === '#text') {
            highlightNode(node.parentNode, color);
        } else if (node && node.style) {
            var boxShadowOrg = node.style.boxShadow;

            var player = node.animate([
                {boxShadow: '0 0 0 5px rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 1)'},
                {boxShadow: '0 0 0 5px rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0)'}
            ], duration);

            player.onfinish = function () {
                node.style.boxShadow = boxShadowOrg;
            };
        }
    }

    function scrollIntoView(node) {
        if (node && node.nodeName === '#text') {
            scrollIntoView(node.parentNode);
        } else if(node.scrollIntoViewIfNeeded) {
            node.scrollIntoViewIfNeeded();
        }
    }

    function showNode(node){
        scrollIntoView(node);
        blinkNode(node);
    }

    function show(selector){
        Array.prototype.forEach.call( $(selector), function(n){
            scrollIntoView(n);
            blinkNode(n)
        });
    }

    self.extend({
        showNode: showNode,
        colorNode: colorNode,
        show: show
    });

})(window.antiXSSExtension);