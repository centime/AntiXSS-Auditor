(function () {
    "use strict";

    function formatSource(source) {
        var d = document.createElement('span') ;
        d.innerText = source ;
        d.classList.add('source');
        return d
    }

    function formatButton(type, entryPointId) {
        var ex = document.createElement('button') ;
        ex.innerText = type ;
        ex.classList.add(type);
        ex.dataset.entryPointId = entryPointId ;
        return ex
    }


    function formatDetails(details, entryPointId) {
        var d = document.createElement('em') ;
        d.innerText = details ;
        d.classList.add('details');
        return d
    }

    function formatCode(code) {
        // Todo expand code
        // http://jsfiddle.net/retaF/8/
        var d = document.createElement('div') ;
        d.innerText = code ;
        d.classList.add('code');
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


    EntryPointsTable.prototype.createEntry = function (entryPointId, source, details, code, buttons) {
        
        var tr, tdSource, tdDetails, tdCode, tdBtns;


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
        tr.id = 'id-'+entryPointId ;
        tdSource = document.createElement('td');
        tdDetails = document.createElement('td');
        tdCode = document.createElement('td');
        tdBtns = document.createElement('td');


        tdSource.appendChild( source ) ;
        tdDetails.appendChild( details ) ;
        tdCode.appendChild( code ) ;
        tdBtns.appendChild( buttons ) ;

        tr.appendChild(tdSource);
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


    EntryPointsTable.prototype.addEntryPoint = function (entryPoint, entryPointId) { 

        var source, details, code, buttons ;


        source = formatSource( entryPoint.source );

        details = formatDetails( entryPoint.details, entryPointId );

        code = formatCode( entryPoint.code );

        buttons = document.createElement('div') ;
        buttons.appendChild( 
            formatButton( 'exploit', entryPointId ) 
        );
        
        switch (entryPoint.vector) {
            case "active":
                source.classList.add('node');
                source.classList.add('htmlAttribute');
                source.classList.add('active');
                source.dataset.nodeId = entryPoint.nodeId;
                break
            case "passive":
                buttons.appendChild( 
                    formatButton( 'analyze', entryPointId ) 
                );
                break;

        }

        this.createEntry( entryPointId, source, details, code, buttons );
    };

    function formatDetail(str){
        var d = document.createElement('div') ;
        d.innerText = str ;
        return d
    }

    EntryPointsTable.prototype.updateDetails = function ( node, diff) { 

        var details = node.querySelector('.details');

        details.innerHTML = "";
        details.appendChild( formatDetail( 
            "impact: "+Math.round(100*diff.removed.length/diff.total)+'%'
        ) );

    };

    EntryPointsTable.prototype.updateSource = function ( node, entryPointId) { 

        var source = node.querySelector('.source');

        source.classList.add('node');
        source.classList.add('htmlAttribute');
        source.classList.add('active');
        source.dataset.entryPointId = entryPointId;

    };

    EntryPointsTable.prototype.updateButtons = function ( node ) { 

        var analyzeBtn = node.querySelector('.analyze');
        analyzeBtn.parentElement.removeChild(analyzeBtn); // WTF ? http://stackoverflow.com/questions/3387427/remove-element-by-id

    };

    EntryPointsTable.prototype.update = function ( entryPointId, diff) {

        var row = (this._tableBody).querySelector('#id-'+entryPointId);
        if (row){
            this.updateSource(row, entryPointId);
            this.updateDetails(row, diff);
            this.updateButtons(row);
        }

    };


    window.EntryPointsTable = EntryPointsTable;

})();
