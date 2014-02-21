/*

    Export Wikipedia tabls as CSV extension.

    Test URL: https://en.wikipedia.org/wiki/List_of_sovereign_states

    Author: Declan Cook
*/

function exportTable(table) {

    var output = '',
        seporator = ','

    table.find('th').each(function (i, e) {
        output += csvStringEscape($(this).text()) + seporator
    })

    output = output.substr(0, output.length - 1)
    output += '\n'

    table.find('tbody tr:visible').each(function () {
        if($(this).hasClass('wikicsv-ignore'))
            return

        var rowString = ''

        $(this).find('td').filter(":visible").each(function () {
            var cellText = csvStringEscape(text($(this)))
            if(cellText.length > 0) {
                rowString += cellText + ","
            }
          })

        rowString = rowString.substr(0, rowString.length - 1)
        rowString += '\n'
        output += rowString
    })

    return output
}

function csvStringEscape (str) {
    str = str.replace(/\"/g, '""')
    if(str.indexOf(',')  > -1 || str.indexOf('"')  > -1 || str.indexOf('\n') > -1) {
        str = '"' + str + '"'
    }
    return str
}

function buildUi () {

     $('table.wikitable').each(function() {
        var table = $(this)
        var col = table.find('th').length
        var tr = $('<tr>')
        tr.addClass('wikicsv-ignore')
        tr.html('<td colspan="' + col + '""><a href="#" class="wikicsv-export">Export</a></td>');
        table.find('tbody').append(tr);
        $('.wikicsv-export').on('click', function() {
            $(this).closest('table.wikitable')
            var blob = new Blob([exportTable($(this).closest('table.wikitable'))], {type: 'text/csv'})
            this.download = 'wikicsv.csv'
            this.href = window.URL.createObjectURL(blob)
            this.dataset.downloadurl =  ['text/csv', this.download, this.href].join(':')
        })
     })
}

function text( elems ) {
    var ret = "", elem;

    for ( var i = 0; elems[i]; i++ ) {
        elem = elems[i];

        if(elem.style && elem.style.display == "none" && elem.nodeType == "SUP") continue

        // Get the text from text nodes and CDATA nodes
        if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
            ret += elem.nodeValue;

        // Traverse everything else, except comment nodes
        } else if ( elem.nodeType !== 8 ) {
            ret += text( elem.childNodes );
        }
    }

    return ret;
}

buildUi()