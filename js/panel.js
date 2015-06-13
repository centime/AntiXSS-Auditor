(function () {
    "use strict";

    var statusElem = document.querySelector('.status');
    var clearBtn = document.querySelector('.clear');
    var recordBtn = document.querySelector('.record');
    var topBtn = document.querySelector('.top');
    var table = document.querySelector('.entry-points');
    var intro = document.querySelector('.intro');

    var scrollHelper = new ScrollHelper(topBtn);
    var entryPointsTable = new EntryPointsTable(table);

    var inspectedURL;

    recordBtn.addEventListener('click', function () {
        entryPointsTable.clear();
        ContentScriptProxy.findHtmlAttributes();
        ContentScriptProxy.findScripts();


        if (intro.style.display !== 'none') {
            var player = intro.animate([
                {opacity: 1},
                {opacity: 0}
            ], 300);

            player.onfinish = function () {
                intro.style.display = 'none';
            };
        }
    });

    clearBtn.addEventListener('click', function () {
        entryPointsTable.clear();
    });

    topBtn.addEventListener('click', function () {
        scrollHelper.scrollToTheTop();
    });

    // clicking
    table.addEventListener('click', function (e) {
        var target = e.target;

        // on a node
        if (target && target.classList.contains('node') && target.dataset.nodeid) {
            if (e.shiftKey) {
                ContentScriptProxy.inspectNode(target.dataset.nodeid);
            } else {
                if (target.classList.contains('htmlAttribute')){         
                    ContentScriptProxy.highlightNode(target.dataset.nodeid);
                } else if (target.classList.contains('script')) {
                    // well..
                }
            }
        // on an "exploit" button
        } else if (target && target.classList.contains('exploit') && target.dataset.exploit) {

            bgPageConnection.postMessage({
                type: 'new-tab',
                url: inspectedURL + '#' + target.dataset.exploit, //todo what if 2 #'s ?
                
            });

        }
    }, false);

    /**
     * BACKGROUND PAGE CONNECTION
     */

    function injectContentScript() {
        // The injections are alledgedly sequential
        // http://stackoverflow.com/questions/23641873/is-code-passed-to-sequential-chrome-tabs-executescript-calls-guaranteed-to-run-i
        bgPageConnection.postMessage({
            type: 'inject',
            tabId: chrome.devtools.inspectedWindow.tabId,
            scriptsToInject: [
                "js/content-scripts/jquery.min.js",
                "js/content-scripts/jQuery-GetPath.js",
                "js/content-scripts/Init.js",
                "js/content-scripts/Highlighter.js",
                "js/content-scripts/HtmlAttributes.js",
                "js/content-scripts/Scripts.js",
                "js/content-scripts/Ready.js"
                ]
        });
    }

    var bgPageConnection = chrome.runtime.connect({
        name: "devtools-page"
    });

    bgPageConnection.onMessage.addListener(function handleMessage(message) {
        if (message.type === 'connected') {
            statusElem.classList.add('connected') ;
            inspectedURL = message.url ;

            entryPointsTable.clear();

        } else if (message.type === 'disconnected') {
            statusElem.classList.remove('connected');

            injectContentScript();

        } else if (message.type === 'entryPoint') {
            entryPointsTable.addEntryPoint(message.entryPoint);
            
            if (message.entryPoint.vector === 'htmlAttribute'){
                ContentScriptProxy.colorNode(message.entryPoint.node.nodeId);
            }
        }
    });

    injectContentScript();
})();
