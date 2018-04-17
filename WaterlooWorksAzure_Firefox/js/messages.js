function messageListAjax() {

    var table = $('#dashboard_userCommonMyMessagesTableID');

    if (!table.length || table.hasClass('myMessageTable'))
        return;

    table.addClass('myMessageTable');

    // replace thead td (avoid css selector err)
    table.find('thead tr td').after($('<th></th>')).remove();

    // change thead name
    var thead = table.find('thead');
    thead.find('th:nth-child(2) a').html('<i class="icon-star"></i>');
    thead.find('th:nth-child(8) a').html('<i class="icon-eye-open"></i>');

    // reorder thead
    if (options.MSG_BetterColumn) {
        var thead = table.find('thead tr');
        $(thead).find('th:last-child').after($(thead).find('th:nth-child(4)'));
        $(thead).find('th:last-child').after($(thead).find('th:nth-child(3)'));
        $(thead).find('th:nth-child(2)').after($(thead).find('th:nth-child(6)'));
    }

    if (options.MSG_FixTableHeader)
        fixTableHeader(table);

    // loop through each row
    table.find('tbody tr').each(function (index, tr) {

        // click row to open msg
        var onclick = $(tr).find('td:nth-child(1) a').attr('onclick');
        if (options.MSG_OpenInNewTab)
            onclick = onclick.replace(/ /g, '').replace("'').submit()", "'','_blank').submit()");
        $(tr).attr('onclick', onclick);

        // change priority icon
        var prioTD = $(tr).find('td:nth-child(2)');
        if (prioTD.text().match(/Normal/))
            prioTD.html('<i class="icon-star-empty azure-msg-normal-icon"></i>');
        else
            prioTD.html('<i class="icon-star azure-msg-important-icon"></i>');

        // change has viewed icon & bold new msg
        var viewTD = $(tr).find('td:nth-child(8)');
        if (viewTD.text().match(/Yes/)) {
            viewTD.html('<i class="icon-envelope azure-msg-viewed-icon"></i>');
        } else {
            viewTD.html('<i class="icon-envelope-alt azure-msg-not-viewed-icon"></i>');
            $(tr).addClass('azure-msg-is-new');
        }

        // switch column order
        if (options.MSG_BetterColumn) {
            $(tr).find('td:last-child').after($(tr).find('td:nth-child(4)'));
            $(tr).find('td:last-child').after($(tr).find('td:nth-child(3)'));
            $(tr).find('td:nth-child(2)').after($(tr).find('td:nth-child(6)'));
        }
    });

}

function removeMessageListHeaderBg() {
    var table = $('#dashboard_userCommonMyMessagesTableID');

    if (!table.length)
        return;

    table.find('thead').css('background-color', '');
    table.find('thead tr th').css('background-color', '');
    table.find('thead tr td').css('background-color', '');
}

function injectMessageListCSS() {
    // message table stylesheet
    injectCSS(baseURL + 'css/messages.css', 'head');

    // detect current section and auto hide columns
    var colCss = '';
    if (options.MSG_BetterColumn) {

        colCss += tableColumnCSS('.myMessageTable', 1, {'display': 'none'});
        colCss += tableColumnCSS('.myMessageTable', 2, {
            'width': '20px',
            'text-align': 'center',
            'padding-left': '8px',
            'padding-right': '4px'
        });
        colCss += tableColumnCSS('.myMessageTable', 3, {
            'width': '20px',
            'text-align': 'center',
            'padding-left': '4px',
            'padding-right': '8px'
        });
        colCss += tableColumnCSS('.myMessageTable', 4, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 5, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 6, {'width': '30%'});
        colCss += tableColumnCSS('.myMessageTable', 7, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 8, {'width': '15%'});
        colCss += tableColumnCSS('.myMessageTable', 9, {'display': 'none'});
        colCss += tableColumnCSS('.myMessageTable', 10, {
            'width': '12%',
            'text-align': 'right',
            'padding-right': '20px'
        });

        var tabName = $('.tab-content .row-fluid:nth-child(2) .span12 .nav.nav-pills .active a').text();
        if (tabName.match(/inbox/gi)) {
            colCss += tableColumnCSS('.myMessageTable', 5, {'display': 'none'});
        } else if (tabName.match(/sent/gi)) {
            colCss += tableColumnCSS('.myMessageTable', 4, {'display': 'none'});
        }

        if (!options.MSG_ShowCategory) {
            colCss += tableColumnCSS('.myMessageTable', 7, {'display': 'none'});
            colCss += tableColumnCSS('.myMessageTable', 8, {'display': 'none'});
        }

    }
    // default col width
    else {
        colCss += tableColumnCSS('.myMessageTable', 1, {'display': 'none'});
        colCss += tableColumnCSS('.myMessageTable', 2, {
            'width': '30px',
            'text-align': 'center',
            'padding-left': '2px',
            'padding-right': '2px'
        });
        colCss += tableColumnCSS('.myMessageTable', 3, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 4, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 5, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 6, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 7, {'width': '30%'});
        colCss += tableColumnCSS('.myMessageTable', 8, {
            'width': '30px',
            'text-align': 'center',
            'padding-left': '2px',
            'padding-right': '2px'
        });
        colCss += tableColumnCSS('.myMessageTable', 9, {'width': '12%'});
        colCss += tableColumnCSS('.myMessageTable', 10, {'width': '15%'});
        if (!options.MSG_ShowCategory) {
            colCss += tableColumnCSS('.myMessageTable', 9, {'display': 'none'});
            colCss += tableColumnCSS('.myMessageTable', 10, {'display': 'none'});
        }
    }
    injectCSS(colCss, 'head', 'text');
}

function messageList() {

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

    $(document).load(function () {
        messageListAjax();
    });
    $(document).ajaxComplete(function (event, xhr, settings) {
        messageListAjax();
    });

    setTimeout(injectMessageListCSS, 1);

}

messageList();