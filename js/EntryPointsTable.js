(function () {
    "use strict";

    function formatNode(entryPoint) {
        var d = document.createElement('span') ;
        d.innerText = entryPoint.node.selector ;
        d.dataset.nodeid = entryPoint.node.nodeId ;
        d.classList.add('node');
        d.classList.add(entryPoint.vector);
        return d
    }

    function formatButtons(entryPoint) {
        var container, ex;
        container = document.createElement('div') ;
        ex = document.createElement('button') ;
        ex.innerText = "exploit" ;
        ex.dataset.exploit = entryPoint.exploit ;
        ex.classList.add('exploit');
        container.appendChild(ex);
        return container
    }

    function formatNodeFromString(str) {
        var d = document.createElement('span') ;
        d.innerText = str ;
        return d
    }

        function formatDetails(entryPoint) {
        var d = document.createElement('em') ;
        d.innerText = entryPoint.details ;
        return d
    }

    function formatCode(code) {
        // Todo expand code
        // http://jsfiddle.net/retaF/8/
        var d = document.createElement('div') ;
        d.innerText = code ;
        return d
    }

    function EntryPointsTable(table) {
        this._tableHead = table.tHead;
        this._tableBody = table.tBodies[0];
        this._counter = this._tableHead.querySelector('.counter');
        this._count = this._tableBody.children.length;

    }

    EntryPointsTable.prototype._updateEntryPointCounter = function () {
        (this._counter).innerText = '(' + this._count + ')';
    };

    EntryPointsTable.prototype.clear = function () {
        (this._tableBody).innerHTML = '';

        this._count = 0;
        this._updateEntryPointCounter();
    };


    EntryPointsTable.prototype.createEntry = function (node, details, code, buttons, vector) {
        
        var tr, tdNode, tdDetails, tdCode, tdBtns;


        // // TODO expand groups
        // //check if events should be grouped together
        // var tRows = (this._tableBody).children;
        // for (var i=0; i<tRows.length; i++){
        //     if (tRows[i] && tRows[i].dataset.code === entryPoint.code && tRows[i].dataset.type === entryPoint.type) {
        //         tdNode = tRows[i].querySelector('td:nth-child(1)');

        //         tRows[i].dataset.count++;

        //         tdNode.innerHTML = '<span class="group-toggle">( ' + tRows[i].dataset.count + ' )</span>';

        //         this._count++;
        //         this._updateEntryPointCounter();
        //         return;
        //     }
        // }

        tr = document.createElement('tr');
        tdNode = document.createElement('td');
        tdDetails = document.createElement('td');
        tdCode = document.createElement('td');
        tdBtns = document.createElement('td');

        // tr.dataset.code = entryPoint.code; // todo : full code unescaped. WTF am I doing ?
        // tr.dataset.details = entryPoint.details;
        // tr.dataset.count = parseInt(tr.dataset.count || "1", 10);

        tr.classList.add(vector);

        tdNode.appendChild( node ) ;
        tdDetails.appendChild( details ) ;
        tdCode.appendChild( code ) ;
        tdBtns.appendChild( buttons ) ;

        tr.appendChild(tdNode);
        tr.appendChild(tdDetails);
        tr.appendChild(tdCode);
        tr.appendChild(tdBtns);

        //insert at the top/beginning
        (this._tableBody).insertBefore(tr, this._tableBody.firstChild);

        tr.animate([
            {opacity: 0},
            {opacity: 1}
        ], 300);

        this._count++;
        this._updateEntryPointCounter();

    };


    EntryPointsTable.prototype.addEntryPoint = function (entryPoint) { 

        var node, details, code, buttons ;

        details = formatDetails(entryPoint) ;
        code = formatCode(entryPoint.code) ;

        switch (entryPoint.vector) {
            case "htmlAttribute":
                node = formatNode(entryPoint) ;
                buttons = formatButtons(entryPoint) ;
                break;
            case "inline":
                node = formatNodeFromString("Inline script") ;
                break;
            case "external":
                node = formatNodeFromString(entryPoint.src) ;
                break;

        }

        buttons = buttons || document.createElement('span') ;

        this.createEntry( node, details, code, buttons, entryPoint.vector );
    };


    window.EntryPointsTable = EntryPointsTable;

})();
