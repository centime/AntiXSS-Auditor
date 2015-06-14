(function () {
    "use strict";

    var statusElem = document.querySelector('.status');
    var clearBtn = document.querySelector('.clear');
    var recordBtn = document.querySelector('.record');
    var analyzeAllBtn = document.querySelector('.analyze-all');
    var topBtn = document.querySelector('.top');
    var table = document.querySelector('.entry-points');
    var intro = document.querySelector('.intro');

    var scrollHelper = new ScrollHelper(topBtn);
    var entryPointsTable = new EntryPointsTable(table);

    var inspectedURL;
    var originalDOM;
    var entryPointsRegistry = [];
    var cripplingExploit = {};

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

    analyzeAllBtn.addEventListener('click', function () {

        var i=0;
        Array.prototype.forEach.call(entryPointsRegistry, function(ep){
            if ( (ep.vector === 'passive') && !(ep.diff) ){
                bgPageConnection.postMessage({
                    type: 'analyze',
                    url: inspectedURL,
                    exploit: ep.exploit, //todo what if 2 #'s ?
                });
            }
        });



    });
    clearBtn.addEventListener('click', function () {
        entryPointsTable.clear();

        entryPointsRegistry = [];
        cripplingExploit = {};
    });

    topBtn.addEventListener('click', function () {
        scrollHelper.scrollToTheTop();
    });

    // clicking
    table.addEventListener('click', function (e) {
        var target = e.target;

        // on a node
        if (target && target.classList.contains('node') ) {   
            // an "active" entryPoint. Highlight just that.
            if (target.dataset.nodeId){

                ContentScriptProxy.highlightNode( target.dataset.nodeId );

            } else if (target.dataset.entryPointId) {
                var diff = entryPointsRegistry[target.dataset.entryPointId].diff ;
                if (diff) {
                    Array.prototype.forEach.call( diff.removed, ContentScriptProxy.highlight );
                }
            }

        //on an "exploit" button
        } else if (target && target.classList.contains('exploit') ) {

            bgPageConnection.postMessage({
                type: 'exploit',
                url: inspectedURL,
                exploit: entryPointsRegistry[target.dataset.entryPointId].exploit, //todo what if 2 #'s ?
            });
        // on an "analyze" button
        } else if (target && target.classList.contains('analyze') ) {

            bgPageConnection.postMessage({
                type: 'analyze',
                url: inspectedURL,
                exploit: entryPointsRegistry[target.dataset.entryPointId].exploit, //todo what if 2 #'s ?
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

    function getEntryPointId(entryPoint) {
        var id = entryPointsRegistry.indexOf(entryPoint);

        if (id === -1) {
            entryPointsRegistry.push(entryPoint);
            id = entryPointsRegistry.length - 1;
        }
        return id
    }

    bgPageConnection.onMessage.addListener(function handleMessage(message) {

        switch (message.type) {

            case 'connected':
                statusElem.classList.add('connected') ;
                inspectedURL = message.url ;

                entryPointsTable.clear();
                break;

            case 'disconnected':
                statusElem.classList.remove('connected');

                injectContentScript();
                break;

            case 'entryPoint':
                var entryPointId = getEntryPointId(message.entryPoint);
                entryPointsTable.addEntryPoint(message.entryPoint, entryPointId);
                
                if (message.entryPoint.vector === 'active'){
                    ContentScriptProxy.colorNode(message.entryPoint.nodeId);
                }
                break;

            // This is where we fetch the DOMs to "analyze"
            case 'DOM':
                if (message.original) {
                    originalDOM = message.DOM ;
                } else {
                    var exploit = cripplingExploit[message.id];
                    var diff = DOMDiff(originalDOM, message.DOM);

                    // all the entryPoints with the same exploit will have the same impact. Group update.
                    for (var i=0; i<entryPointsRegistry.length; i++){ // todo : nasty loop is nasty

                        if ( entryPointsRegistry[i].exploit === exploit ){
                            entryPointsRegistry[i].diff = diff ;
                            entryPointsTable.update( i, diff );

                        }
                    }

                }
                break;

            case 'exploitId':
                // id of the page in which the exploit is being tested
                cripplingExploit[message.id] = message.exploit ;
                break;

        }
    });

    injectContentScript();
})();
