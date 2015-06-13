(function () {
    "use strict";

    function callCommand(cmd) {
        chrome.devtools.inspectedWindow.eval(
            cmd,
            {useContentScriptContext: true},
            function (isException, result) {
                console.log(isException, result)
                if (isException || chrome.runtime.lastError) {
                    console.log('Content script command call failed.', cmd, result, chrome.runtime.lastError);
                }
            }
        );
    }

    window.ContentScriptProxy = {
        findEventElements: function () {
            callCommand('antiXSSExtension.findEventElements()');
        },
        inspectNode: function (nodeId) {
            callCommand('inspect(antiXSSExtension.getNode(' + nodeId + '))');
        },
        highlightNode: function (nodeId) {   ;
            callCommand('antiXSSExtension.showNode(antiXSSExtension.getNode(' + nodeId + '))');
        },
        colorNode: function (nodeId) {
            callCommand('antiXSSExtension.colorNode(antiXSSExtension.getNode(' + nodeId + '))');
        }
    };
})();
