var prioIdx, ackIdx, fromIdx, toIdx, subIdx, recIdx, viewIdx, cateIdx, subCateIdx, respIdx;
var msgCssInjected = false;

/**
 * Optimization scripts for message list
 * Runs every time an ajax request completes
 */
function messageListAjax() {

    function _calculateColIndex() {
        var thead = table.find('thead');
        thead.find('tr th').each(function (i, e) {
            if (typeof $(e).attr('data-original-text') === typeof undefined) {
                $(e).attr('data-original-text', $(e).text().trim());
            }
            var thText = $(e).attr('data-original-text');
            if (thText.match(/Priority/))
                prioIdx = i;
            else if (thText.match(/Acknowledgement Required/))
                ackIdx = i;
            else if (thText.match(/From/))
                fromIdx = i;
            else if (thText.match(/To/))
                toIdx = i;
            else if (thText.match(/Subject/))
                subIdx = i;
            else if (thText.match(/Date Received/))
                recIdx = i;
            else if (thText.match(/Viewed/))
                viewIdx = i;
            else if (thText.match(/Category/) && !thText.match(/Sub Category/))
                cateIdx = i;
            else if (thText.match(/Sub Category/))
                subCateIdx = i;
            else if (thText.match(/Date Responded/))
                respIdx = i;
        });
    }

    var table = $('#dashboard_userCommonMyMessagesTableID');

    if (!table.length)
        return;

    if ($('#dashboard_userCommonMyMessagesTableHead').text().trim() == '')
        return;

    table.addClass('myMessageTable');

    // replace thead td (avoid css selector err)
    table.find('thead tr td').after($('<th></th>')).remove();

    // change thead name
    _calculateColIndex();

    // reorder thead
    if (options.MSG_BetterColumn) {
        var theadTH = table.find('thead tr th');
        // chagne icon
        $(theadTH[prioIdx]).html('<i class="icon-star"></i>');
        $(theadTH[viewIdx]).html('<i class="icon-eye-open"></i>');
        $(theadTH[ackIdx]).html(function () {
            return $(this).html().replace('Acknowledgement Required', 'Ack Req\'d');
        });
        // change order
        $(theadTH[viewIdx]).insertAfter($(theadTH[prioIdx]));
        $(theadTH[recIdx]).insertAfter($(theadTH[subCateIdx]));
    }

    // if (options.MSG_FixTableHeader)
    //     fixTableHeader(table);

    // loop through each row
    table.find('tbody tr').each(function (index, tr) {
        var trTD = $(tr).children('td');

        // click row to open msg
        var onclick = $(trTD[0]).children('a').attr('onclick');
        if (options.MSG_OpenInNewTab) {
            onclick = onclick.replace(/ /g, '').replace("'').submit()", "'','_blank').submit()");
            $(trTD[0]).children('a').attr('onclick', onclick);
        }

        // switch column order
        if (options.MSG_BetterColumn) {

            $(tr).attr('onclick', onclick);

            // change priority icon
            var prioTD = $(trTD[prioIdx]);
            if (prioTD.text().match(/Normal/))
                prioTD.html('<i class="icon-star-empty azure-msg-normal-icon"></i>');
            else
                prioTD.html('<i class="icon-star azure-msg-important-icon"></i>');

            // change has viewed icon & bold new msg
            var viewTD = $(trTD[viewIdx]);
            if (viewTD.text().match(/Yes/)) {
                viewTD.html('<i class="icon-envelope azure-msg-viewed-icon"></i>');
            } else {
                viewTD.html('<i class="icon-envelope-alt azure-msg-not-viewed-icon"></i>');
                $(tr).addClass('azure-msg-is-new');
            }

            // remove new badge from subject
            // var badge = $(trTD[subIdx]).find('.badge').remove();

            // add Ack Req to subject - removed
            // if (!$(trTD[ackIdx]).text().match(/No/)) {
            //     $(trTD[subIdx]).prepend('<span class="badge badge-info text-uppercase inline-block margin-right-5">Ack Req\'d</span>');
            // }

            // change order
            $(trTD[viewIdx]).insertAfter($(trTD[prioIdx]));
            $(trTD[recIdx]).insertAfter($(trTD[subCateIdx]));
        }
    });

    _calculateColIndex();
    injectMessageListCSS();
    // resize top scroll bar (waterlooworks origianl function)
    setTimeout(function () {
        sizeTopScroll();
        // if (options.MSG_FixTableHeader)
        //     fixTableHeader(table);
    }, 100);

}

/**
 * Generate and inject customized css
 */
function injectMessageListCSS() {

    if (msgCssInjected) return;
    msgCssInjected = true;

    // message table stylesheet
    injectCSS(baseURL + 'css/messages.css', 'head');

    // detect current section and auto hide columns
    var colCss = '';
    if (options.MSG_BetterColumn) {
        colCss += tableColumnCSS('.myMessageTable', 1, {'display': 'none'});
        colCss += tableColumnCSS('.myMessageTable', prioIdx + 1, {
            'width': '20px',
            'text-align': 'center',
            'padding-left': '8px',
            'padding-right': '4px'
        });
        colCss += tableColumnCSS('.myMessageTable', viewIdx + 1, {
            'width': '20px',
            'text-align': 'center',
            'padding-left': '4px',
            'padding-right': '8px'
        });
        colCss += tableColumnCSS('.myMessageTable', ackIdx + 1, {'display': 'none'});
        colCss += tableColumnCSS('.myMessageTable', subIdx + 1, {'width': '30%'});
        colCss += tableColumnCSS('.myMessageTable', recIdx + 1, {
            'width': '12%',
            'text-align': 'right',
            'padding-right': '20px'
        });
        colCss += tableColumnCSS('.myMessageTable', respIdx + 1, {'display': 'none'});
        var tabName = $('.tab-content .row-fluid:nth-child(2) .span12 .nav.nav-pills .active a').text();
        if (tabName.match(/inbox/gi)) {
            colCss += tableColumnCSS('.myMessageTable', fromIdx + 1, {'width': '12%'});
            colCss += tableColumnCSS('.myMessageTable', toIdx + 1, {'display': 'none'});
        } else if (tabName.match(/sent/gi)) {
            colCss += tableColumnCSS('.myMessageTable', fromIdx + 1, {'display': 'none'});
            colCss += tableColumnCSS('.myMessageTable', toIdx + 1, {'width': '12%'});
        } else {
            colCss += tableColumnCSS('.myMessageTable', fromIdx + 1, {'width': '12%'});
            colCss += tableColumnCSS('.myMessageTable', toIdx + 1, {'width': '12%'});
        }

        if (!options.MSG_ShowCategory) {
            colCss += tableColumnCSS('.myMessageTable', cateIdx + 1, {'display': 'none'});
            colCss += tableColumnCSS('.myMessageTable', subCateIdx + 1, {'display': 'none'});
        } else {
            colCss += tableColumnCSS('.myMessageTable', cateIdx + 1, {'width': '12%'});
            colCss += tableColumnCSS('.myMessageTable', subCateIdx + 1, {'width': '15%'});
        }

    }
    // default col width
    else {
        colCss += '#dashboard_userCommonMyMessages_gridBox {overflow-x: auto !important;}';
        colCss += '.myMessageTable {table-layout: auto;}';
        colCss += '.myMessageTable td {max-width: 200px !important;}';
        colCss += '#dashboard_userCommonMyMessages_topScrollBox {display: block;}';
    }
    injectCSS(colCss, 'head', 'text');
}

/**
 * Remove message list header inline background css
 */
function removeMessageListHeaderBg() {
    var table = $('#dashboard_userCommonMyMessagesTableID');

    if (!table.length)
        return;

    table.find('thead').css('background-color', '');
    table.find('thead tr th').css('background-color', '');
    table.find('thead tr td').css('background-color', '');
}

/**
 * Optimization scripts for message list
 * Runs only once after page loaded
 */
function messageList() {

    if (typeof jQuery === typeof  undefined) return;

    var tableContainer = $('#dashboard_userCommonMyMessages');
    if (!tableContainer.length)
        return;

    // remove header bg (for dark theme)
    removeMessageListHeaderBg();
    $(document).ajaxComplete(function (event, xhr, settings) {
        removeMessageListHeaderBg();
    });

    if (!options.MSG_Enabled)
        return;

    messageListAjax();
    $(document).ajaxComplete(function (event, xhr, settings) {
        messageListAjax();
    });

}

/**
 * Start
 */
messageList();