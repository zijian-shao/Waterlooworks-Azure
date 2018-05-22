function isShortlistPage() {
    var moduleHeader = $('.orbisModuleHeader');
    if (moduleHeader.length && moduleHeader.text().match(/ - Shortlist/gi)) {
        return true;
    }
}

function rankStarHTML(score) {

    var int = Math.round(score);
    var html = '';

    for (var i = 0; i < int; i++) {
        html += '<i class="icon-star"></i>';
    }
    for (var i = 5 - int; i > 0; i--) {
        html += '<i class="icon-star-empty"></i>';
    }

    return html;
}

function floatInfoPanel() {
    function testPostingFloatInfo() {
        if ($(window).width() >= 980) {
            if (isOnScreen(spanTop)) {
                columnSpanFloat.fadeOut(200, function () {
                    columnSpan.fadeIn(200);
                });
            } else {
                columnSpan.fadeOut(200, function () {
                    columnSpanFloat.fadeIn(200);
                });
            }
        } else {
            columnSpanFloat.hide();
            columnSpan.show();
        }
    }

    var columnSpan = $('.orbisTabContainer .tabbable .tab-content .row-fluid .span4');
    var spanTop = columnSpan.position().top;
    var spanLeft = columnSpan.position().left;
    var spanWidth = columnSpan.width();

    // column
    var columnSpanFloat = columnSpan.clone();
    columnSpanFloat.attr('id', 'azure-posting-info-panel-float');
    columnSpanFloat.css({
        'position': 'fixed',
        'display': 'block',
        'width': spanWidth + 'px',
        'top': (themeConfig.navbarHeight + 10) + 'px',
        'left': (spanLeft - 4) + 'px'
    });
    columnSpanFloat.hide();
    columnSpan.after(columnSpanFloat);

    testPostingFloatInfo();
    $(window).on('scroll', function () {
        testPostingFloatInfo();
    });
    $(window).on('resize', function () {
        columnSpan.show();
        spanLeft = columnSpan.position().left;
        spanWidth = columnSpan.width();
        spanTop = columnSpan.position().top;
        columnSpanFloat.css({
            'position': 'fixed',
            'display': 'block',
            'width': spanWidth + 'px',
            'top': (themeConfig.navbarHeight + 10) + 'px',
            'left': (spanLeft - 4) + 'px'
        });
        testPostingFloatInfo();
    });
}

function addKeyWordReminder(tagArr) {

    if (!tagArr.length) return;

    // remove duplicated tags
    var uniqueTags = [];

    for (var i = 0, len = tagArr.length; i < len; i++) {
        tagArr[i] = tagArr[i].toLowerCase();
    }

    for (var i = 0, len = tagArr.length; i < len; i++) {
        if ((i == tagArr.indexOf(tagArr[i])) || (tagArr.indexOf(tagArr[i]) == tagArr.lastIndexOf(tagArr[i])))
            uniqueTags.push(tagArr[i].replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }));
    }

    var panelBody = $('<div class="panel-body"></div>')
    $.each(uniqueTags, function (i, v) {
        panelBody.append($('<span class="label label-warning">' + v + '</span>'));
    });

    var panel = $('<div class="panel panel-default azure-posting-keyword-panel"></div>');
    panel.append($('<div class="panel-heading"><small class="tip pull-right">Configure it in Extension Options</small><strong>HIGHLIGHTED KEYWORDS</strong></div>'));
    panel.append(panelBody);

    var columnSpan = $('.orbisTabContainer .tabbable .tab-content .row-fluid .span4');
    columnSpan.find('.panel:last-child').first().after(panel);

}

function addPostingInfoPanel() {

    var title = $('.orbisModuleHeader .row-fluid:first-child .span6:first-child').first();
    var columnSpan = $('.orbisTabContainer .tabbable .tab-content .row-fluid .span4');

    // panel add
    var panel = $('<div class="panel panel-default azure-posting-info-panel"></div>');
    panel.append($('<div class="panel-heading"><strong>POSTING INFO</strong></div>'));
    panel.append($('<div class="panel-body">' + title.html() + '</div>'));
    columnSpan.find('.panel:first-child').first().before(panel);

}

function showCompanyRank(data) {

    var company = $('.orbisModuleHeader').find('h5').first();
    var companyName = company.text().split('-')[0].trim().replace(/\t/g, '').replace(/\n/g, '');
    var response = data.response;
    var rank;

    // result exist
    if (response.totalRecordCount > 0) {

        // if first result matches, add score & link
        if (response.employers['0'].name.match(new RegExp(companyName, 'i'))) {

            var score = Number(response.employers['0'].overallRating).toFixed(1);

            var link = '';
            if (response.employers['0'].hasOwnProperty('featuredReview')) {
                link = response.employers['0'].featuredReview.attributionURL;
            } else if (response.hasOwnProperty('attributionURL')) {
                link = response.attributionURL;
            } else {
                link = 'https://www.glassdoor.ca';
            }

            rank = $('<span class="azure-company-ranking">' + rankStarHTML(score) + ' ' + score + '<a href="' + link + '" target="_blank"><i class="icon-share-alt"></i> View In Glassdoor</a></span>');

        }

        // if not, add link to search result page
        else {

            rank = $('<span class="azure-company-ranking azure-company-ranking-empty"><a href="' + response.attributionURL + '" target="_blank"><i class="icon-share-alt"></i> View In Glassdoor</a></span>');

        }

    } else {

        // result does not exist
        rank = $('<span class="azure-company-ranking azure-company-ranking-empty"><a href="https://www.glassdoor.com" target="_blank"><i class="icon-share-alt"></i> Visit Glassdoor</a></span>');
    }

    rank.hide();
    company.append(rank);
    $('.azure-posting-info-panel .panel-body').append(rank.clone());
    $('.azure-company-ranking').fadeIn(300);


}

function showPostingModal(tr) {

    function _showPostingModal(data) {

        // prepare modal
        var popupModal = $('#popup-modal');
        var popupModalBody = $('#popup-modal-body');
        var popupModalFooter = $('#popup-modal-footer');
        var html = $($.parseHTML(data));

        var testError = html.find('#mainContentDiv .alert-error');
        if (testError.length) {
            alert(testError.text().trim());
            return;
        } else if (!html.find('#postingDiv').length) {
            alert('Unknown error. Please refresh the page and try again.');
            return;
        }

        html = html.find('#postingDiv');

        // save all tr into a single element
        var tableRows = [];
        html.find('.panel.panel-default .panel-body').children('.table').children('tbody').children('tr').each(function (i, tr) {
            tableRows.push($(tr));
        });

        // init configs
        var rowConfig = options.JOB_PopupModalRows;
        var rowConfig2 = {};
        for (var i = 0, len = Object.keys(rowConfig).length; i < len; i++) {
            rowConfig2[rowConfig['row_' + i]['name']] = rowConfig['row_' + i]['display'];
        }
        rowConfig = rowConfig2;

        // add selected row
        var jobTitle, jobCompany;
        var newTable = $('<table class="table table-striped table-bordered"></table>');
        for (var key in rowConfig) {
            tableRows.forEach(function (currVal) {
                var rowName = currVal.children('td').first().text();
                if (rowName.match(/job title/i)) {
                    jobTitle = currVal.children('td').last().text().trim();
                } else if (rowName.match(/organization/i)) {
                    jobCompany = currVal.children('td').last().text().trim();
                }
                else if (rowConfig[key] == true && rowName.match(new RegExp(key, 'i'))) {
                    newTable.append(currVal);
                }
            });
        }

        // init body
        newTable = $('<div class="table-responsive"></div>').append(newTable);
        popupModalBody.html(newTable);

        // prepare buttons
        var buttons = $('<div/>');

        if (apply !== null && apply !== undefined && tr.css('display') != 'none')
            buttons.append(
                buttonCreateUtil('Apply', 'a', {
                    'href': 'javascript:void(0);',
                    'onclick': apply,
                    'class': 'btn btn-success margin-left-5',
                    'id': 'modal-btn-apply'
                })
            );

        if (shortlist !== null && shortlist !== undefined && tr.css('display') != 'none')
            if (!inShortlist)
                buttons.append(
                    buttonCreateUtil('Shortlist', 'a', {
                        'href': 'javascript:void(0);',
                        'onclick': shortlist,
                        'class': 'btn btn-default margin-left-5 modal-btn-shortlist',
                        'id': 'modal-btn-shortlist'
                    })
                );
            else
                buttons.append(
                    buttonCreateUtil('Unshortlist', 'a', {
                        'href': 'javascript:void(0);',
                        'onclick': shortlist,
                        'class': 'btn btn-default margin-left-5 modal-btn-shortlist',
                        'id': 'modal-btn-shortlist'
                    })
                );

        if (notInterested !== null && notInterested !== undefined && tr.css('display') != 'none')
            buttons.append(buttonCreateUtil('Not Interested', 'a', {
                    'href': 'javascript:void(0);',
                    'onclick': notInterested,
                    'class': 'btn btn-default margin-left-5',
                    'id': 'modal-btn-not-interested'
                })
            );

        buttons.append(buttonCreateUtil('New Tab', 'a', {
                'href': 'javascript:void(0);',
                'onclick': newTab,
                'class': 'btn btn-primary margin-left-5',
                'id': 'modal-btn-new-tab'
            })
        );

        // add buttons
        buttons.append($('<button type="button" class="btn btn-default margin-left-5" data-dismiss="modal">Close</button>'));

        var postingActions = $('<div class="modal-posting-actions"></div>').append(buttons.clone());
        popupModalBody.prepend(postingActions);

        popupModalFooter.html(buttons.clone());

        // add title
        popupModalBody.prepend($('<p class="modal-organization">' + jobCompany + '</p>'));
        if (tr.css('display') != 'none') {
            popupModalBody.prepend($('<h1 class="modal-job-title">' + jobTitle + '</h1>'));
        } else {
            popupModalBody.prepend($('<h1 class="modal-job-title">' + jobTitle + ' <span style="color:red">(Not Interested)</span></h1>'));
        }

        // add nav
        var modalNav = $('<div class="modal-nav"></div>');

        if (tr.prev('tr').length)
            modalNav.append($('<i class="prev-posting icon-chevron-left" id="modal-nav-prev"></i>'));

        if (tr.next('tr').length)
            modalNav.append($('<i class="next-posting icon-chevron-right" id="modal-nav-next"></i>'));

        popupModalBody.prepend(modalNav);

        if (!popupModal.hasClass('in'))
            popupModal.modal('show');

        $('.modal-scrollable').scrollTop(0);

        $('.modal-btn-shortlist').on('click', function () {
            if ($(this).text().match(/unshortlist/i)) {
                $('.modal-btn-shortlist').text('Shortlist');
            } else {
                $('.modal-btn-shortlist').text('Unshortlist');
            }
        });

        $('#modal-btn-not-interested').on('click', function () {
            popupModal.modal('hide');
        });


        $('#modal-nav-prev').on('click', function () {
            var prev = $($('#postingsTable').children('tbody').children('tr')[parseInt(tr.attr('data-index')) - 1]);
            showPostingModal(prev);
        });

        $('#modal-nav-next').on('click', function () {
            var next = $($('#postingsTable').children('tbody').children('tr')[parseInt(tr.attr('data-index')) + 1]);
            showPostingModal(next);
        });
    }

    // init data
    var apply = tr.attr('data-apply'),
        shortlist = tr.attr('data-shortlist'),
        inShortlist = (tr.attr('data-in-shortlist') == 'true'),
        notInterested = tr.attr('data-not-interested'),
        currentTab = tr.attr('data-current-tab'),
        newTab = tr.attr('data-new-tab');

    // init post
    var currentTabForm = currentTab.replace('.submit()', '');
    currentTabForm = eval(currentTabForm);
    currentTabForm = currentTabForm.serialize();

    blockPage('rgba(0,0,0,0.2)');

    $.post(window.location, currentTabForm, function (data) {
        unblockPage();
        _showPostingModal(data);
    });

}

function postingListAjax(table, placeholder) {

    if (!table.length)
        return;

    // add class (for stylesheet)
    table.addClass('postingsTable');

    // remove table header bg color
    table.find('thead').css('background-color', '');
    table.find('thead tr th').css('background-color', '');
    table.find('thead tr td').css('background-color', '');

    // replace thead td (avoid css selector err)
    table.find('thead tr td').after($('<th></th>')).remove();

    // backup original table for export
    var tableBackup = '';
    if (isShortlistPage() && options.JOB_ShortlistExport)
        tableBackup = table.clone();

    // generate hide column css & shorten table headings
    var tableTh = table.find('thead tr th');
    var showColCSS = '';

    if (options.JOB_ColumnDisplayType == 1) {
        var colCount = tableTh.length;
        var selectedCols = options.JOB_ColumnSelected;
        selectedCols = JSON.stringify(selectedCols);
        selectedCols = selectedCols.replace(/-/gi, ' ');
        selectedCols = JSON.parse(selectedCols);
        showColCSS += '.postingsTable>tbody>tr>td,.postingsTable>thead>tr>th{display:none}';
    } else {
        showColCSS += tableColumnCSS('.postingsTable', 5, {'display': 'none'});
        showColCSS += tableColumnCSS('.postingsTable', 6, {'display': 'none'});
    }

    var jobTitleLink = '', organizationLink = '', divisionLink = '';

    tableTh.each(function (index, th) {

        var thText = $(th).text();

        if (options.JOB_ColumnDisplayType == 1) {

            for (var i = 0, len = selectedCols.length; i < len; i++) {

                // general / first col / last col
                if (thText.match(new RegExp(selectedCols[i], 'i'))
                    || (index == 0 && selectedCols[i].match(/action buttons/i))
                    || (index == colCount - 1 && selectedCols[i].match(/not interested/i)))

                    showColCSS += tableColumnCSS('.postingsTable', index + 1, {'display': 'table-cell'});
            }
        }

        if (thText.match(/App Status/))
            $(th).text('Status');

        else if (thText.match(/Job Title/))
            jobTitleLink = $(th).children('a');

        else if (thText.match(/Organization/))
            organizationLink = $(th).children('a');

        else if (thText.match(/Division/))
            divisionLink = $(th).children('a');

        else if (thText.match(/Openings/))
            $(th).children('a').text('Open');

        else if (thText.match(/Applications/))
            $(th).children('a').text('Apps');

        else if (thText.match(/Internal Status/))
            $(th).children('a').text('Int Status');

        else if (thText.match(/App Deadline/))
            $(th).children('a').text('Deadline');

        else if (thText.match(/Position Type/))
            $(th).children('a').text('Type');

    });

    if (options.JOB_ColumnDisplayType == 0) {
        jobTitleLink.removeAttr('style');
        organizationLink.removeAttr('style');
        divisionLink.removeAttr('style');
        jobTitleLink.after(divisionLink.clone());
        jobTitleLink.after('<i class="icon-angle-right" style="opacity:0.4"></i>');
        jobTitleLink.after(organizationLink.clone());
        jobTitleLink.after('<i class="icon-angle-right" style="opacity:0.4"></i>');
    }

    injectCSS(showColCSS, 'head', 'text');

    // fixed header
    if (options.JOB_FixTableHeader)
        fixTableHeader(table);

    // float pagination
    if (options.JOB_FloatPagination) {
        var act = placeholder.find('.orbis-posting-actions:last-child');
        var li = act.find('li');
        // if pagination exist
        if (li.length)
            act.addClass('orbis-posting-actions-float');
    }

    if (options.JOB_FlipPageBackToTop) {
        // flip page
        var li = placeholder.find('.orbis-posting-actions:last-child li');
        li.each(function (index, element) {
            if (!$(element).hasClass('disabled')) {
                $(element).children('a').on('click', function () {
                    if (!isOnScreen(table)) {
                        scrollToUtil(table, 0);
                    }
                });
            }
        });

        // sort
        placeholder.find('table thead tr th a').on('click', function () {
            if (!isOnScreen(table)) {
                scrollToUtil(table, 0);
            }
        });
    }

    // hide/show NEW tag
    if (options.JOB_NewTagSwitch) {

        // remove listener and element
        if ($('#azure-toggle-new-tag').length)
            $('#azure-toggle-new-tag').off('click').remove();

        // find new tags
        var tags = table.find('tbody tr td:nth-child(4) span.label-inverse');

        // create btn
        var switchBtn = $('<a/>', {
            'href': 'javascript:void(0);',
            'class': 'btn btn-small btn-right-4',
            'id': 'azure-toggle-new-tag'
        });
        if (hideNewTagStatus) {
            tags.hide();
            switchBtn.text('Show NEW Tag');
        } else {
            switchBtn.text('Hide NEW Tag');
        }

        switchBtn.on('click', function (e) {
            e.preventDefault();
            hideNewTagStatus = !hideNewTagStatus;

            if (hideNewTagStatus) {
                tags.hide();
                $(this).text('Show NEW Tag');
            } else {
                tags.show();
                $(this).text('Hide NEW Tag');
            }
        });

        // add btn
        $('#hideSideNav').after(switchBtn);

    }

    // empty shortlist
    if (options.JOB_EmptyShortlistButton) {

        if (isShortlistPage()) {

            // remove listener and element
            if ($('#azure-empty-shortlist').length)
                $('#azure-empty-shortlist').off('click').remove();

            // create btn
            var emptyBtn = $('<a/>', {
                'href': 'javascript:void(0);',
                'class': 'btn btn-small btn-right-4',
                'id': 'azure-empty-shortlist'
            });
            emptyBtn.text('Empty Shortlist');

            // btn event
            emptyBtn.on('click', function (e) {

                e.preventDefault();

                var popupConfirm = confirm("Do you want to clear all shortlisted jobs on current page?");
                if (!popupConfirm)
                    return;

                // block page
                blockPage();

                // get all onclick events
                var actionList = [];
                table.find('tbody tr td:nth-child(1)').each(function (index1, td) {
                    actionList.push($(td).children('a').attr('onclick'));
                });
                var actionListLength = actionList.length;

                // remove every 800ms, otherwise will get portal error
                for (var i = 0; i < actionListLength; i++) {

                    (function (i) {

                        window.setTimeout(function () {
                            eval(actionList[i]);
                        }, i * 800);

                    }(i));

                }

                setTimeout(function () {
                    if (!$('#postingsTable').length) {
                        $('#azure-empty-shortlist').remove();
                    }
                    unblockPage();
                }, actionListLength * 800);

            });

            // add btn
            $('#hideSideNav').after(emptyBtn);
        }
    }

    // export shortlist
    if (options.JOB_ShortlistExport) {

        if (isShortlistPage()) {

            // remove listener and element
            if ($('#azure-export-shortlist').length)
                $('#azure-export-shortlist').off('click').remove();

            // create btn
            var exportBtn = $('<a/>', {
                'href': 'javascript:void(0);',
                'class': 'btn btn-success btn-small btn-right-4',
                'id': 'azure-export-shortlist'
            });
            exportBtn.text('Export Shortlist')

            // btn event
            if (isBrowser('chrome') || isBrowser('safari') || isBrowser('opera')) {
                exportBtn.on('click', function (e) {
                    e.preventDefault();
                    tableBackup.tableExport({
                        type: 'excel',
                        escape: 'false',
                        ignoreColumn: '[0, 1]'
                    });
                });
            } else if (isBrowser('firefox')) {
                exportBtn.on('click', function () {

                    // For Firefox only
                    var download = tableBackup.tableExport({
                        type: 'excel',
                        escape: 'false',
                        ignoreColumn: '[0, 1]'
                    });
                    $(this).attr({
                        'href': download.filelink,
                        'download': download.filename
                    });
                });
            }

            // add btn
            $('#hideSideNav').after(exportBtn);
        }
    }

    // hide shortlisted
    if (options.JOB_ShortlistedSwitch) {

        if (!isShortlistPage()) {

            // remove listener and element
            if ($('#azure-hide-shortlisted').length)
                $('#azure-hide-shortlisted').off('click').remove();

            var shortedList = [];

            table.find('tbody tr').each(function (index, tr) {
                if ($(tr).find('td:first-child').children('a').first().text().match(/unshortlist/i)) {
                    shortedList.push($(tr));
                }
            });

            // create btn
            var hideBtn = $('<a/>', {
                'href': 'javascript:void(0);',
                'class': 'btn btn-small btn-right-4',
                'id': 'azure-hide-shortlisted'
            });
            if (hideShortlistedStatus) {
                shortedList.forEach(function (e) {
                    e.addClass('hidden');
                });
                hideBtn.text('Show Shortlisted');
            } else {
                hideBtn.text('Hide Shortlisted');
            }

            // btn event
            hideBtn.on('click', function (e) {
                e.preventDefault();
                hideShortlistedStatus = !hideShortlistedStatus;

                if (hideShortlistedStatus) {
                    shortedList.forEach(function (e) {
                        e.addClass('hidden');
                    });
                    $(this).text('Show Shortlisted');
                } else {
                    shortedList.forEach(function (e) {
                        e.removeClass('hidden');
                    });
                    $(this).text('Hide Shortlisted');
                }
            });

            // add btn
            $('#hideSideNav').after(hideBtn);
        }
    }

    // context menu & new tabs
    if (options.JOB_ContextMenu)
        contextMenuUtil('create');

    // loop through and modify each row
    table.find('tbody tr').each(function (index, tr) {

        $(tr).attr('data-index', index);

        var apply, shortlist, inShortlist, notInterested, jobIntro, currentTab, newTab;

        // loop through the view drop down list and get onclick script
        $(tr).find('td:nth-child(1) li a').each(function (index1, a1) {

            // current tab
            if (index1 == 0) {
                currentTab = $(a1).attr('onclick');
                $(tr).attr('data-current-tab', currentTab);
            }
            // new tab
            else if (index1 == 1) {
                newTab = $(a1).attr('onclick');
                $(tr).attr('data-new-tab', newTab);
            }
        });

        // cache job title link
        var jobTitleLink = $(tr).find('td:nth-child(4) a');

        // combine title, organization, division
        if (options.JOB_ColumnDisplayType == 0)
            jobTitleLink.after($('<p class="combined-info"><span class="organization">' + $(tr).children('td:nth-child(5)').text() + '</span><i class="icon-angle-right"></i><span class="division">' + $(tr).children('td:nth-child(6)').text() + '</span></p>'));

        // click job title and open in new tab
        if (options.JOB_OpenInNewTab) {

            if (isBrowser('chrome') || isBrowser('safari') || isBrowser('opera')) {
                jobTitleLink.removeAttr('onclick').off('click');

                jobTitleLink.on('click', function (e) {

                    e.preventDefault();

                    if (e.which === 1) {
                        if ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.shiftKey))
                            eval(currentTab);
                        else if (e.ctrlKey || e.metaKey)
                            window.open(location.href + '#' + encodeURI(currentTab));
                        else
                            eval(newTab);
                    }

                });

                // new tab link (deprecated)
                // jobTitleLink.after($('<a href="javascript:void(0);" class="view-in-new-tab-link" onclick="' + newTab + '"><i class="icon-external-link"></i><span> New Tab</span></a>'));

            } else if (isBrowser('firefox')) {
                jobTitleLink.removeAttr('onclick').off('click').attr('href', location.href + '#' + encodeURI(currentTab));

                jobTitleLink.on('click', function (e) {
                    e.preventDefault();

                    if (e.which === 1) {
                        if (e.ctrlKey || e.metaKey)
                            eval(currentTab);
                        else
                            eval(newTab);
                    }

                });

                // new tab link (deprecated)
                // jobTitleLink.after($('<a href="javascript:void(0);" class="view-in-new-tab-link" onclick="' + newTab + '"><i class="icon-external-link"></i><span> New Tab</span></a>'));
            }
        }

        // get apply link & shortlist onclick script
        $(tr).find('td:nth-child(1)').children('a').each(function (index1, a1) {

            // shortlist
            if (index1 == 0) {
                shortlist = $(a1).attr('onclick');
                inShortlist = $(a1).text().match(/Unshortlist/) ? true : false;
                $(tr).attr('data-shortlist', shortlist);
                $(tr).attr('data-in-shortlist', inShortlist);
            }
            // apply
            else if (index1 == 1) {
                apply = $(a1).attr('onclick');
                $(a1).removeClass('btn-primary').addClass('btn-success');
                $(tr).attr('data-apply', apply);
            }

        });

        // get not interested onclick script
        notInterested = $(tr).find('td:last-child').children('a').attr('onclick');
        $(tr).attr('data-not-interested', notInterested);

        // context menu
        if (options.JOB_ContextMenu) {

            // add context menu
            $(tr).contextmenu(function (e) {

                e.preventDefault();

                // clear old menu items
                contextMenuUtil('clear');

                // apply link
                if (apply !== null && apply !== undefined)
                    contextMenuUtil('add', {
                        type: 'link',
                        code: '<i class="icon-ok"></i> Apply',
                        property: {
                            'href': 'javascript:void(0);',
                            'onclick': apply
                        }
                    });

                // shortlist link
                if (shortlist !== null && shortlist !== undefined) {
                    if (!inShortlist)
                        contextMenuUtil('add', {
                            type: 'link',
                            code: '<i class="icon-heart"></i> Shortlist',
                            property: {
                                'href': 'javascript:void(0);',
                                'onclick': shortlist
                            }
                        });
                    else
                        contextMenuUtil('add', {
                            type: 'link',
                            code: '<i class="icon-heart-empty"></i> Unshortlist',
                            property: {
                                'href': 'javascript:void(0);',
                                'onclick': shortlist
                            }
                        });
                }

                // not interested link
                if (notInterested !== null && notInterested !== undefined)
                    contextMenuUtil('add', {
                        type: 'link',
                        code: '<i class="icon-remove"></i> Not Interested',
                        property: {
                            'href': 'javascript:void(0);',
                            'onclick': notInterested
                        }
                    });

                // add line
                contextMenuUtil('add', {
                    type: 'html',
                    code: '<hr>'
                });

                // preview in modal
                if (options.JOB_PopupModal) {
                    contextMenuUtil('add', {
                        type: 'link',
                        code: '<i class="icon-globe"></i> Preview In Modal',
                        property: {
                            'href': 'javascript:void(0);',
                            'id': 'context-menu-preview'
                        }
                    });
                    $('#context-menu-preview').off('click').on('click', function () {
                        showPostingModal($(tr));
                    });
                }

                // current tab link
                contextMenuUtil('add', {
                    type: 'link',
                    code: '<i class="icon-search"></i> View in Current Tab',
                    property: {
                        'href': 'javascript:void(0);',
                        'onclick': currentTab
                    }
                });

                // new tab link
                if (options.JOB_OpenInNewTab)
                    contextMenuUtil('add', {
                        type: 'link',
                        code: '<i class="icon-share-alt"></i> View in New Tab',
                        property: {
                            'href': 'javascript:void(0);',
                            'onclick': newTab
                        }
                    });

                // show
                contextMenuUtil('show', {
                    x: e.pageX,
                    y: e.pageY
                })

            });
        }

        // popup modal
        if (options.JOB_PopupModal) {

            var showPopupBtn = $('<a href="javascript:void(0);" class="modal-show-link"><i class="icon-globe"></i></a>');
            jobTitleLink.before(showPopupBtn);
            showPopupBtn.on('click', function () {
                $(tr).dblclick();
            });

            $(tr).dblclick(function (e) {
                e.preventDefault();
                showPostingModal($(tr));
            });

            // re-calculate table header after modal close
            if (options.JOB_FixTableHeader) {
                $('#popup-modal').on('hidden.bs.modal', function () {
                    setTimeout(function () {
                        fixTableHeader(table);
                    }, 800);
                });
            }
        }
    });

    // resize top scroll bar (waterlooworks origianl function)
    setTimeout(function () {
        sizeTopScroll();
    }, 100);
}

function postingList() {

    var placeholder = $('#postingsTablePlaceholder');
    if (!placeholder.length)
        return;

    // remove aaaa parent background (for dark theme)
    $('.aaaa').parent('div').removeAttr('style');

    var table = $('#postingsTable');
    if (!table.length)
        return;

    // remove table header bg color
    table.find('thead').css('background-color', '');
    table.find('thead tr th').css('background-color', '');
    table.find('thead tr td').css('background-color', '');

    if (!options.JOB_Enabled)
        return;

    // force show sidebar
    setTimeout(function () {
        if ($('#hideSideNav').text().match(/Show Side Nav/)) {
            $('#hideSideNav').trigger('click');
            $('#mainContentDiv').css('margin-left', '');
            fixTableHeader(table);
        }
    }, 1000);

    // cache current url
    var currURL = window.location.href;

    injectCSS(baseURL + 'css/postings.css', 'head');
    // injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/postings.css', 'head');

    // coop
    if (currURL.match(/\/myAccount\/co-op\/coop-postings\.htm/gi))
        injectCSS(baseURL + 'css/postings-coop.css', 'head');

    // grad / full-time
    else if (currURL.match(/\/myAccount\/hire-waterloo\/full-time-jobs\/jobs-postings\.htm/gi))
        injectCSS(baseURL + 'css/postings-grad.css', 'head');

    // alumni
    else if (currURL.match(/\/myAccount\/hire-waterloo\/other-jobs\/jobs-postings\.htm/gi))
        injectCSS(baseURL + 'css/postings-alumni.css', 'head');

    if (options.JOB_ShortlistExport)
        injectJS(baseURL + 'js/plugins/shortlist-export.js', 'head');

    // popup modal
    if (options.JOB_PopupModal) {
        // insert popup modal
        $('body').append($('<div class="modal modal-fluid modal-posting fade" id="popup-modal" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Posting Preview</h4></div><div class="modal-body" id="popup-modal-body"></div><div class="modal-footer" id="popup-modal-footer"></div></div></div></div>'));
        // keyboard event
        if (options.JOB_PopupModalArrowKey)
            $('#popup-modal').keydown(function (e) {
                switch (e.which) {
                    case 37: // left
                        $('#modal-nav-prev').trigger('click');
                        e.preventDefault();
                        break;
                    case 38: // up
                        break;
                    case 39: // right
                        $('#modal-nav-next').trigger('click');
                        e.preventDefault();
                        break;
                    case 40: // down
                        break;
                    default:
                }
            });
    }

    postingListAjax(table, placeholder);

    // For each interact with table, it reloads with ajax
    // So we need to rerun optimization scripts again when table reloads
    // Shortlist / sort column / flip pages all reload table
    $(document).ajaxComplete(function (event, xhr, settings) {

        if ((settings.url === '/myAccount/co-op/coop-postings.htm'
            || settings.url === '/myAccount/hire-waterloo/other-jobs/jobs-postings.htm'
            || settings.url === '/myAccount/hire-waterloo/full-time-jobs/jobs-postings.htm')
            && settings.dataType === 'html') {
            postingListAjax($('#postingsTable'), $('#postingsTablePlaceholder'));
        }

    });

}

function postingDetail() {

    var divDetail = $('#postingDiv');
    if (!divDetail.length)
        return;

    if (options.JOB_FloatDetailPageButton) {

        var actions = $('.orbis-posting-actions');
        if (actions.length) {

            // clone action buttons
            actions = actions.clone().addClass('orbis-posting-actions-btn-float');
            var applyBtn = actions.find('.applyButton');
            applyBtn.removeClass('.applyButton').addClass('applyButton-float');
            applyBtn.on('click', function () {
                $('.applyButton').trigger('click');
            });

            // remove extra elements
            actions.find('form').each(function (index, element) {
                $(element).remove();
            });
            actions.find('script').each(function (index, element) {
                $(element).remove();
            });

            // clone back btn
            var backBtn = $('.orbisModuleHeader').find('.row-fluid .pager li:nth-child(2) a').clone().addClass('btn btn-large').text('Back');

            actions.children('div').append(backBtn);

            $('body').append(actions);
        }
    }

    // Highlight Keywords
    if (options.JOB_DetailPageHighlight) {
        var hlKws = options.JOB_DetailPageHighlightKeywords;
        if (Array.isArray(hlKws) && hlKws.length) {
            var regStr = '';
            hlKws.forEach(function (val) {
                val = val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                regStr += '(\\b' + val + ')|';
            });
            regStr = regStr.slice(0, -1);
            regStr = '(' + regStr + ')';

            var hlRegex = new RegExp(regStr + '(?![^<>]*>)', 'ig');
            var matchedArr = [];

            $('#postingDiv').find('tr td:last-child').each(function () {

                var matched = $(this).html().match(hlRegex);
                if (matched) {
                    $(this).html(
                        $(this).html().replace(hlRegex, '<span class="azure-keyword-highlight">$1</span>')
                    );
                    Array.prototype.push.apply(matchedArr, matched);
                }

            });

            addKeyWordReminder(matchedArr);
        }
    }

    if (options.JOB_DetailPostingInfoPanel)
        addPostingInfoPanel();

    if (options.JOB_FloatDetailPageInfo)
        floatInfoPanel();

    if (options.JOB_GlassdoorRanking) {

        var company = $('.orbisModuleHeader').find('h5').first();
        var companyName = company.text().split('-')[0].trim().replace(/\t/g, '').replace(/\n/g, '');
        injectJS('https://www.zijianshao.com/wwazure/glassdoor/?callback=showCompanyRank&q=' + companyName, 'head');

    }

    if (options.JOB_DetailPageFontSize) {
        var nav = $('.tabbable .tab-content .nav:first-child');
        nav.addClass('span8');
        $('<div class="row-fluid"></div>').insertBefore(nav).append(nav);

        var fontDEC = $('<li class="pull-right azure-font-size-control"><a href="javascript:;"><i class="icon-font"></i>-</a></li>').appendTo(nav);
        var fontINC = $('<li class="pull-right azure-font-size-control"><a href="javascript:;"><i class="icon-font"></i>+</a></li>').appendTo(nav);

        // panel list
        var panelTD = $('#postingDiv table td');
        var fontSize = 1.0;

        fontINC.on('click', function () {
            if (fontSize <= 1.5) {
                fontSize = fontSize + 0.1;
                panelTD.css({
                    'font-size': fontSize + 'em',
                    'line-height': (fontSize * 1.5) + 'em'
                });
            }
        });

        fontDEC.on('click', function () {
            if (fontSize >= 1.0) {
                fontSize = fontSize - 0.1;
                panelTD.css({
                    'font-size': fontSize + 'em',
                    'line-height': (fontSize * 1.5) + 'em'
                });
            }
        });

    }

}

postingList();
postingDetail();