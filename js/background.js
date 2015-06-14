(function () {
    "use strict";

    function injectScriptFile(file, tabId, at){
        at = at || "document_start" ;
        chrome.tabs.executeScript(tabId, {
            file: file,
            runAt: at
        }, function () {
            if (chrome.runtime.lastError) {
                console.log('Error injecting script ',file, chrome.runtime.lastError.message);
            }
        });
    }

    chrome.runtime.onConnect.addListener(function (port) {

        switch (port.name) {

            case 'devtools-page':
                handleDevToolsConnection(port);
                break;

            case 'content-script':
                handleContentScriptConnection(port);
                break;

            case 'analyze':
                handleAnalyzeConnection(port);
                break;

        }
    });

    var devToolsPorts = {};
    var contentScriptPorts = {};

    function handleDevToolsConnection(port) {
        var tabId;

        var messageListener = function (message, sender, sendResponse) {
            console.log('devtools panel', message, sender);

            if (message.type === 'inject') {
                tabId = message.tabId;
                devToolsPorts[tabId] = port;
            

                Array.prototype.forEach.call(
                    message.scriptsToInject, 
                    function(file){
                        injectScriptFile(file, tabId);
                    }
                );


                injectScriptFile("js/content-scripts/GetDOM.js", tabId, "document_end" );

            } else if (message.type === 'exploit') {

                chrome.tabs.create({ 
                    url: message.url + '#' + message.exploit,
                    selected: true 
                });

            } else if (message.type === 'analyze') {

                chrome.tabs.create(
                    { 
                        url: message.url + '#' + message.exploit,
                        selected: false,
                        pinned: true, 
                    },
                    function( crippledPageTab ){
                        analyzeCrippledPage( message.exploit, crippledPageTab.id, port) ;
                    }
                );

            } else {
                //pass message from DevTools panel to a content script
                if (contentScriptPorts[tabId]) {
                    contentScriptPorts[tabId].postMessage(message);
                }
            }
        };

        port.onMessage.addListener(messageListener);

        port.onDisconnect.addListener(function () {
            devToolsPorts[tabId] = undefined;
            contentScriptPorts[tabId] = undefined;
            port.onMessage.removeListener(messageListener);
        });
    }

    function handleContentScriptConnection(port) {
        var tabId = port.sender.tab.id;

        contentScriptPorts[tabId] = port;

        var messageListener = function (message, sender, sendResponse) {
            console.log('content script', message, tabId);

            if (message.type === 'DOM'){
                message.original = true ;
            }

            //pass message from content script to the appropriate DevTools panel
            if (devToolsPorts[tabId]) {
                devToolsPorts[tabId].postMessage(message);
            }
        };

        port.onMessage.addListener(messageListener);

        port.onDisconnect.addListener(function () {
            port.onMessage.removeListener(messageListener);

            //let devtools panel know that content script has disconnected
            if (devToolsPorts[tabId]) {
                devToolsPorts[tabId].postMessage({
                    type: 'disconnected'
                });
            }
        });
    }


    function handleAnalyzeConnection(port) {

        var messageListener = function (message, sender, sendResponse) {
            console.log('analyze page', message);
            var crippledPageTabId = port.sender.tab.id;
            message.id = crippledPageTabId ; // id of the page in which the exploit (unknown in this context) has been tested
            

            //pass message from content script to the appropriate DevTools panel
            if (devToolsPorts[crippledPageTabId]) {
                devToolsPorts[crippledPageTabId].postMessage(message);
            }
            // close the tab. We should receive only one message: the DOM
            chrome.tabs.remove(crippledPageTabId);
        };

        port.onMessage.addListener(messageListener);

    }


    function analyzeCrippledPage (exploit, crippledPageTabId, devtoolPort){

        devToolsPorts[crippledPageTabId] = devtoolPort ;

        // used by devtool to match the response from the crippled page and the cripling exploit
        devtoolPort.postMessage({
            type: 'exploitId',
            exploit: exploit,
            id: crippledPageTabId // id of the page in which the exploit is being tested
        });



        injectScriptFile("js/content-scripts/jquery.min.js", crippledPageTabId );
        injectScriptFile("js/content-scripts/jQuery-GetPath.js", crippledPageTabId );
        injectScriptFile("js/content-scripts/AnalyzeInit.js", crippledPageTabId );
        injectScriptFile("js/content-scripts/GetDOM.js", crippledPageTabId, "document_end" );
    }
})();