(function () {
    "use strict";

    function formatNode(entryPoint) {
        return '<span class="node '+entryPoint.vector+'" data-nodeid="' + entryPoint.node.nodeId + '">' + entryPoint.node.selector + '</span>';
    }


    function formatType(entryPoint) {
        var type = "";
        switch (entryPoint.vector) {
            case "eventElement":
                type = '<em>' + entryPoint.type + '</em>';
                break;
        }

        return type;
    }

    function formatCode(code) {
        // Todo expand code
        // http://jsfiddle.net/retaF/8/
        return '<span class="code">' + code + '</span>';
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

    EntryPointsTable.prototype.addEntryPoint = function (entryPoint) {
        
        var tdNode, tdType, tdCode, tr;


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
        tdType = document.createElement('td');
        tdCode = document.createElement('td');

        tr.dataset.code = entryPoint.code; // todo : full code unescaped. WTF am I doing ?
        tr.dataset.type = entryPoint.type;
        tr.dataset.count = parseInt(tr.dataset.count || "1", 10);

        tr.classList.add(entryPoint.vector.replace(' ', '-'));

        tdNode.innerHTML = '<div>' + formatNode(entryPoint) + '</div>';
        tdType.innerHTML = '<div>' + formatType(entryPoint) + '</div>';
        tdCode.innerHTML = '<div>' + formatCode(entryPoint.code) + '</div>';

        tr.appendChild(tdNode);
        tr.appendChild(tdType);
        tr.appendChild(tdCode);

        //insert at the top/beginning
        (this._tableBody).insertBefore(tr, this._tableBody.firstChild);

        tr.animate([
            {opacity: 0},
            {opacity: 1}
        ], 300);

        this._count++;
        this._updateEntryPointCounter();

    };

    window.EntryPointsTable = EntryPointsTable;

})();
