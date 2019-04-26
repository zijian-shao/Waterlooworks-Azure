var hideNewTagStatus = false, hideShortlistedStatus = false;

/**
 * GENERAL
 * Detect if current page is filtered by shortlist
 * @returns {boolean}
 */
function isShortlistPage() {

    if (typeof isShortlistPage.rtnVal === typeof undefined) {
        var moduleHeader = $('.orbisModuleHeader');
        isShortlistPage.rtnVal = moduleHeader.length && moduleHeader.text().match(/ - Shortlist/);
    }

    return isShortlistPage.rtnVal;

}

/**
 * GENERAL
 * Detect if current page is filtered by not interested
 * @returns {boolean}
 */
function isNotInterestedPage() {

    if (typeof isNotInterestedPage.rtnVal === typeof undefined) {
        var table = $('#postingsTable');
        if (!table.length) {
            isNotInterestedPage.rtnVal = false;
        } else {
            isNotInterestedPage.rtnVal = table.find('tbody tr').first().find('td:last-child').text().match(/Include/);
        }

    }

    return isNotInterestedPage.rtnVal;

}

/**
 * POSTING DETAILS
 * Float right side panel on detail page
 */
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
        'top': (themeConfigs.navbarHeight + 10) + 'px',
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
            'top': (themeConfigs.navbarHeight + 10) + 'px',
            'left': (spanLeft - 4) + 'px'
        });
        testPostingFloatInfo();
    });
}

/**
 * POSTING DETAILS & MODAL
 * Force links in posting detail open in new tab
 * @param Element that is table or contains table
 */
function detailPageLinkNewTab(table) {
    table.find('tr td a').each(function () {
        $(this).attr('target', '_blank');
    });
}

/**
 * POSTING DETAILS
 * Add posting title to page title
 */
function detailPageTitle() {
    var jobTitle = $('#mainContentDiv > div.orbisModuleHeader > div.row-fluid > div:nth-child(1) > h1').text();
    jobTitle = jobTitle.trim().replace(/\n/g, '').replace(/\t/g, '').replace(/Job ID:([0-9]+) /g, '');
    var company = $('#mainContentDiv > div.orbisModuleHeader > div.row-fluid > div:nth-child(1) > h5');
    company.find('span').remove();
    company = company.text().trim().split(' - ');
    company.pop();
    company = company.join(' - ');
    var pageTitle = $('head title');
    pageTitle.text(jobTitle + ' - ' + company + ' - ' + pageTitle.text());
}

/**
 * POSTING DETAILS & MODAL
 * Highlight matched keywords
 * @param table Element that is table or contains table
 * @param needPanel Boolean. If true, add panel to the right
 */
function highlightKeyword(table, needPanel) {

    function _addKeyWordReminder(tagArr) {

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

        table.find('tr td:last-child').each(function () {

            var matched = $(this).html().match(hlRegex);
            if (matched) {
                $(this).html(
                    $(this).html().replace(hlRegex, '<span class="azure-keyword-highlight">$1</span>')
                );
                Array.prototype.push.apply(matchedArr, matched);
            }

        });

        if (needPanel === true)
            _addKeyWordReminder(matchedArr);
    }
}

/**
 * POSTING DETAILS
 * Add posting title & organization to the right
 */
function addPostingInfoPanel() {

    var title = $('.orbisModuleHeader .row-fluid:first-child .span6:first-child').first();
    var columnSpan = $('.orbisTabContainer .tabbable .tab-content .row-fluid .span4');

    // panel add
    var panel = $('<div class="panel panel-default azure-posting-info-panel"></div>');
    panel.append($('<div class="panel-heading"><strong>POSTING INFO</strong></div>'));
    panel.append($('<div class="panel-body">' + title.html() + '</div>'));
    columnSpan.find('.panel:first-child').first().before(panel);

}

/**
 * POSTING DETAILS
 * Add glassdoor company ranking (Callback function)
 * @param data
 */
function showCompanyRank(data) {

    function _rankStarHTML(score) {

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


    var company = $('.orbisModuleHeader').find('h5').first();
    var companyName = company.text().split('-')[0].trim().replace(/\t/g, '').replace(/\n/g, '');
    var response = data.response;
    var rank;

    // result exist
    if (response.totalRecordCount > 0) {

        // if first result matches, add score & link
        if (response.employers[0].exactMatch == true) {

            var score = Number(response.employers['0'].overallRating).toFixed(1);

            var link = '';
            if (response.employers[0].hasOwnProperty('featuredReview')) {
                link = response.employers[0].featuredReview.attributionURL;
            } else {
                link = response.attributionURL;
            }

            var numRatings = '';
            if (response.employers[0].hasOwnProperty('numberOfRatings')) {
                numRatings = '<small class="margin-left-5">( ' + response.employers[0].numberOfRatings + ' Ratings )</small>';
            }

            rank = $('<span class="azure-company-ranking">' + _rankStarHTML(score) + ' ' + score + numRatings + '<a href="' + link + '" target="_blank"><i class="icon-share-alt"></i> View in Glassdoor</a></span>');

        }

        // if not, add link to search result page
        else {

            rank = $('<span class="azure-company-ranking azure-company-ranking-empty"><a href="' + response.attributionURL + '" target="_blank"><i class="icon-share-alt"></i> View in Glassdoor</a></span>');

        }

    } else {

        // result does not exist
        rank = $('<span class="azure-company-ranking azure-company-ranking-empty"><a href="' + response.attributionURL + '" target="_blank"><i class="icon-search"></i> Search Glassdoor</a></span>');
    }

    rank.hide();
    company.append(rank);
    $('.azure-posting-info-panel .panel-body').append(rank.clone());
    $('.azure-company-ranking').fadeIn(300);

}

/**
 * POSTING LIST
 * Show target posting preview in modal
 * @param tr The target row in posting list
 */
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
                } else if (rowConfig[key] == true && rowName.match(new RegExp(key, 'i'))) {
                    newTable.append(currVal);
                }
            });
        }

        // init body
        newTable = $('<div class="table-responsive"></div>').append(newTable);
        highlightKeyword(newTable);
        detailPageLinkNewTab(newTable);
        popupModalBody.html(newTable);

        // prepare buttons
        var buttons = $('<div/>');
        var btnTxt = '';
        var btnAttr = {};

        if (apply !== null && apply !== undefined) {
            btnAttr = {
                'href': 'javascript:void(0);',
                'onclick': apply,
                'class': 'btn btn-success margin-left-5',
                'id': 'modal-btn-apply'
            };
            if (options.JOB_PopupModalArrowKey) {
                btnTxt = '<u>A</u>pply';
                btnAttr['accesskey'] = 'a';
            } else {
                btnTxt = 'Apply';
            }
            buttons.append(buttonCreateUtil(btnTxt, 'a', btnAttr));
        }

        if (shortlist !== null && shortlist !== undefined) {
            btnAttr = {
                'href': 'javascript:void(0);',
                'onclick': shortlist,
                'class': 'btn btn-default margin-left-5 modal-btn-shortlist',
                'id': 'modal-btn-shortlist'
            };
            if (!inShortlist) {
                if (options.JOB_PopupModalArrowKey) {
                    btnTxt = '<u>S</u>hortlist';
                    btnAttr['accesskey'] = 's';
                } else {
                    btnTxt = 'Shortlist';
                }

            } else {
                if (options.JOB_PopupModalArrowKey) {
                    btnTxt = 'Un<u>s</u>hortlist';
                    btnAttr['accesskey'] = 's';
                } else {
                    btnTxt = 'Unshortlist';
                }
            }
            buttons.append(buttonCreateUtil(btnTxt, 'a', btnAttr));
        }

        if (notInterested !== null && notInterested !== undefined) {
            if ($(tr).find('td:last-child').last().text().match(/Include/))
                btnTxt = 'Include';
            else
                btnTxt = 'Not Interested';
            buttons.append(buttonCreateUtil(btnTxt, 'a', {
                    'href': 'javascript:void(0);',
                    'onclick': notInterested,
                    'class': 'btn btn-default margin-left-5',
                    'id': 'modal-btn-not-interested'
                })
            );
        }

        btnAttr = {
            'href': 'javascript:void(0);',
            'onclick': newTab,
            'class': 'btn btn-primary margin-left-5',
            'id': 'modal-btn-new-tab'
        };
        if (options.JOB_PopupModalArrowKey) {
            btnTxt = '<u>N</u>ew Tab';
            btnAttr['accesskey'] = 'n';
        } else {
            btnTxt = 'New Tab';
        }
        buttons.append(buttonCreateUtil(btnTxt, 'a', btnAttr));

        // add buttons
        buttons.append($('<button type="button" class="btn btn-default margin-left-5" data-dismiss="modal">Close</button>'));

        var postingActions = $('<div class="modal-posting-actions"></div>').append(buttons.clone());
        popupModalBody.prepend(postingActions);

        var btnsClone = buttons.clone();
        buttons.find('a').removeAttr('accesskey');
        popupModalFooter.html(btnsClone);

        // add title
        popupModalBody.prepend($('<p class="modal-organization">' + jobCompany + '</p>'));
        popupModalBody.prepend($('<h1 class="modal-job-title">' + jobTitle + '</h1>'));

        // add prev / next btn
        var modalNav = $('<div class="modal-nav"></div>');

        var trPrev = tr.prev('tr');
        while (trPrev.length) {
            if (trPrev.css('display') != 'none') {
                modalNav.append($('<i class="prev-posting icon-chevron-left" id="modal-nav-prev"></i>'));
                break;
            } else {
                trPrev = trPrev.prev('tr');
            }
        }

        var trNext = tr.next('tr');
        while (trNext.length) {
            if (trNext.css('display') != 'none') {
                modalNav.append($('<i class="next-posting icon-chevron-right" id="modal-nav-next"></i>'));
                break;
            } else {
                trNext = trNext.next('tr');
            }
        }

        popupModalBody.prepend(modalNav);

        if (!popupModal.hasClass('in'))
            popupModal.modal('show');

        $('.modal-scrollable').scrollTop(0);

        $('.modal-btn-shortlist').on('click', function () {
            if ($(this).text().match(/unshortlist/i)) {
                if (options.JOB_PopupModalArrowKey)
                    $('.modal-btn-shortlist').html('<u>S</u>hortlist');
                else
                    $('.modal-btn-shortlist').text('Shortlist');
            } else {
                if (options.JOB_PopupModalArrowKey)
                    $('.modal-btn-shortlist').html('Un<u>s</u>hortlist');
                else
                    $('.modal-btn-shortlist').text('Unshortlist');
            }
        });

        $('#modal-btn-not-interested').on('click', function () {
            popupModal.modal('hide');
        });


        $('#modal-nav-prev').on('click', function () {
            var cntr = 1;
            var prev;
            do {
                prev = $($('#postingsTable').children('tbody').children('tr')[parseInt(tr.attr('data-index')) - cntr]);
                cntr++;
            } while (prev.css('display') == 'none');
            showPostingModal(prev);
        });

        $('#modal-nav-next').on('click', function () {
            var cntr = 1;
            var next;
            do {
                next = $($('#postingsTable').children('tbody').children('tr')[parseInt(tr.attr('data-index')) + cntr]);
                cntr++;
            } while (next.css('display') == 'none');
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

    // apply in new tab
    if (apply !== undefined)
        apply = apply.replace(").submit()", ", '', '_blank').submit()");

    // init post
    blockPage('rgba(0,0,0,0.2)');

    var currentTabForm = evalBuildForm(currentTab, '', false).serialize();

    $.post(window.location, currentTabForm, function (data) {
        unblockPage();
        _showPostingModal(data);
    });

}

/**
 * POSTING LIST
 * Posting list batch operation
 */
function postingBatch() {

    // get height of each tr and stores in trTop and trHeight
    // get posting id of each tr
    function _getHeightsAndIDs(table) {

        trTop = [];
        trLeft = [];
        trHeight = [];
        trWidth = [];
        postingIDs = [];

        var trs = table.find('tbody tr:visible');
        if (trs.length == 0) return;

        var offsetTBody = table.find('tbody')[0].offsetTop;

        trs.each(function (i, e) {
            // get top and height
            trTop.push($(e)[0].offsetTop - offsetTBody);
            trLeft.push($(e)[0].offsetLeft);
            trHeight.push($(e).height());
            trWidth.push($(e).width());

            // get posting id
            postingIDs.push($(e).attr('id').match(/\d+/)[0]);
        });

    }

    // adjust the height selectable items
    function _adjustHeights(table) {
        var container = $('#azure-batch-container');
        container.css('top', table.children('tbody')[0].offsetTop + 'px');
        container.children('li').each(function (i, e) {
            $(e).css({
                'top': trTop[i] + 'px',
                'left': trLeft[i] + 'px',
                'width': trWidth[i] + 'px',
                'height': trHeight[i] + 'px'
            });
        });
    }

    // count and update selected items
    function _updateSelected() {
        counter = $('li.azure-batch-item.active').length;
        $('#azure-batch-tip-counter').text(counter);
    }

    // run script of different type
    function _executeAjax(type, liList, currIndex) {

        if (typeof currIndex === typeof undefined) {
            currIndex = 0;
        }

        if (counter == 0 || currIndex >= counter) {
            unblockPage();
            $('#azure-posting-batch').trigger('click');
            return;
        }

        if (type == 'shortlist') {

            var thisTr = $('#posting' + $(liList[currIndex]).attr('data-posting-id'));
            if (thisTr.attr('data-in-shortlist') == 'false') {
                setTimeout(function () {
                    evalToggleFavouritePosting(thisTr.attr('data-shortlist'));
                    blockPageMsg('Shortlisting ' + (currIndex + 1) + ' / ' + counter);
                    _executeAjax(type, liList, currIndex + 1);
                }, 500);
            } else {
                blockPageMsg('Shortlisting ' + (currIndex + 1) + ' / ' + counter);
                _executeAjax(type, liList, currIndex + 1);
            }

        } else if (type == 'not-interested') {

            setTimeout(function () {
                evalToggleBlacklistPosting($('#posting' + $(liList[currIndex]).attr('data-posting-id')).attr('data-not-interested'));
                blockPageMsg('Removing ' + (currIndex + 1) + ' / ' + counter);
                _executeAjax(type, liList, currIndex + 1);
            }, 300);

        } else if (type == 'new-tab') {

            setTimeout(function () {
                evalBuildForm($('#posting' + $(liList[currIndex]).attr('data-posting-id')).attr('data-new-tab'));
                blockPageMsg('Opening ' + (currIndex + 1) + ' / ' + counter);
                _executeAjax(type, liList, currIndex + 1);
            }, 300);

        }
    }

    // add the selectable overlay
    function _addBatchCheckbox() {

        var table = $('#postingsTable');
        var tableDiv = $('#postingsTableDiv');

        // get height and margin top
        _getHeightsAndIDs(table);

        // prepare overlay
        var list = $('<ul class="azure-batch-container list-unstyled" id="azure-batch-container" style="top:' + table.children('tbody')[0].offsetTop + 'px"></ul>');
        for (var i = 0, len = trTop.length; i < len; i++) {
            $('<li class="azure-batch-item" style="top:' + trTop[i] + 'px; left:' + trLeft[i] + 'px; width:' + trWidth[i] + 'px; height:' + trHeight[i] + 'px" data-tr-index="' + i + '" data-posting-id="' + postingIDs[i] + '"></li>').appendTo(list);
        }
        list.appendTo(tableDiv);

        $(window).on('resize', function () {
            _getHeightsAndIDs(table);
            _adjustHeights(table);
        });

        // overlay item click event
        var batchItems = $('.azure-batch-item');
        var lastChecked = null;
        batchItems.on('click', function (e) {
            e.preventDefault();

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }

            if (!lastChecked) {
                lastChecked = $(this);
                _updateSelected();
                return;
            }

            if (e.shiftKey) {
                var start = parseInt($(this).attr('data-tr-index'));
                var end = parseInt(lastChecked.attr('data-tr-index'));

                if (lastChecked.hasClass('active')) {
                    batchItems.slice(Math.min(start, end), Math.max(start, end) + 1).addClass('active');
                } else {
                    batchItems.slice(Math.min(start, end), Math.max(start, end) + 1).removeClass('active');
                }

            }

            lastChecked = $(this);

            _updateSelected();
        });

    }

    // add the float container
    function _addTipFloat() {
        $('body').append('<div class="azure-batch-tip-container" id="azure-batch-tip-container"><div class="actions pull-right"><span class="icon"><i class="icon-check"></i></span>&nbsp;<span class="counter" id="azure-batch-tip-counter">0</span><a class="select-all" id="azure-batch-tip-select-all" href="javascript:void(0);">Select All</a><a class="exit-batch" id="azure-batch-tip-exit" href="javascript:void(0);">Exit Batch</a></div><div class="title">Batch Operation</div><div class="desc">Click on postings to select and operate</div><div class="buttons"><a href="javascript:void(0);" class="btn btn-default" id="azure-batch-tip-shortlist">Shortlist</a><a href="javascript:void(0);" class="btn btn-default" id="azure-batch-tip-not-interested">Not Interested</a><a href="javascript:void(0);" class="btn btn-success" id="azure-batch-tip-new-tab">New Tab</a></div></div>');

        // container show animation
        $('#azure-batch-tip-container').animate({
            opacity: 1,
            bottom: '20px'
        }, 500);

        // select all
        $('#azure-batch-tip-select-all').on('click', function (e) {
            e.preventDefault();
            if (counter < trTop.length) {
                $('#azure-batch-container').children('li').each(function () {
                    if (!$(this).hasClass('active'))
                        $(this).trigger('click');
                });
            } else {
                $('#azure-batch-container').children('li').each(function () {
                    if ($(this).hasClass('active'))
                        $(this).trigger('click');
                });
            }
        });

        // exit batch
        $('#azure-batch-tip-exit').on('click', function (e) {
            e.preventDefault();
            $('#azure-posting-batch').trigger('click');
        });

        // shortlist batch
        $('#azure-batch-tip-shortlist').on('click', function (e) {
            e.preventDefault();
            if (counter == 0) {
                alert('Please select an item to start the batch operation.');
                return;
            }
            counterExe = 0;
            var r = confirm("Are you sure to shortlist " + counter + " postings? Already shortlisted postings will be ignored.");
            if (r == true) {
                blockPage();
                blockPageMsg('Please wait');
                $('#azure-batch-tip-container').hide();
                $('#azure-batch-container').hide();
                _executeAjax('shortlist', $('#azure-batch-container').find('li.active'));
            }
        });

        // not interested batch
        if (!currURL.match(/other-jobs/)) {
            $('#azure-batch-tip-not-interested').on('click', function (e) {
                e.preventDefault();
                if (counter == 0) {
                    alert('Please select an item to start the batch operation.');
                    return;
                }
                counterExe = 0;
                var r = confirm("Are you sure to remove " + counter + " postings from the list?");
                if (r == true) {
                    blockPage();
                    blockPageMsg('Please wait');
                    $('#azure-batch-tip-container').hide();
                    $('#azure-batch-container').hide();
                    _executeAjax('not-interested', $('#azure-batch-container').find('li.active'));
                }
            });
        } else {
            $('#azure-batch-tip-not-interested').remove();
        }

        // new tab batch
        $('#azure-batch-tip-new-tab').on('click', function (e) {
            if (counter == 0) {
                alert('Please select an item to start the batch operation.');
                return;
            }
            counterExe = 0;
            if (counter >= 10) {
                var r = confirm("You selected more than 10 postings. Opening too many tabs may cause the browser stop responding. Are you sure you want to continue?");
                if (r == true) {
                    blockPage();
                    blockPageMsg('Please wait');
                    $('#azure-batch-tip-container').hide();
                    $('#azure-batch-container').hide();
                    _executeAjax('new-tab', $('#azure-batch-container').find('li.active'));
                }
            } else {
                blockPage();
                blockPageMsg('Please wait');
                $('#azure-batch-tip-container').hide();
                $('#azure-batch-container').hide();
                _executeAjax('new-tab', $('#azure-batch-container').find('li.active'));
            }

            e.preventDefault();
        });
    }

    function _enterBatch() {

        counter = 0;
        blockUI($('#postingsTablePlaceholder'), 'trasparent', 0, 200);
        $('#azure-hide-shortlisted').hide(); // hide btn
        $('#azure-toggle-new-tag').hide(); // hide btn
        $('#postingsTableDiv').scrollLeft(0).css('position', 'relative').css('overflow-x', 'hidden'); // disable table h-scroll and reset scroll
        $('#postingsTable-thead').remove(); // remove fixed table header
        $('#azure-hide-sidebar').hide(); // hide sidebar control btn


        // add selectable overlay
        _addBatchCheckbox();
        // add operation btn container
        _addTipFloat();

        // changge batch btn status
        $('#azure-posting-batch').text('Exit batch').attr('data-in-batch', '1');
    }

    function _exitBatch() {
        unblockUI($('#postingsTablePlaceholder'), 0);
        $('#azure-hide-shortlisted').show(); // show btn
        $('#azure-toggle-new-tag').show(); // show btn
        $('#postingsTableDiv').css('position', '').css('overflow-x', 'auto'); // allow table h-scroll
        fixTableHeader($('#postingsTable')); // fix table header
        $('#azure-hide-sidebar').show(); // show sidebar control btn

        $('#azure-batch-container').remove(); // remove overlay container
        $('#azure-batch-tip-container').remove(); // remove operation btn container

        // change batch btn status
        $('#azure-posting-batch').text('Batch').attr('data-in-batch', '0');
    }

    // if already exist
    if ($('#azure-posting-batch').length)
        return;

    // disable on not interested / shortlist page
    if (isNotInterestedPage() || isShortlistPage())
        return;

    var trTop = []; // css top
    var trLeft = [];
    var trHeight = []; // css height
    var trWidth = [];
    var postingIDs = []; // posting id list
    var counter = 0; // counter for selected items
    var counterExe = 0; // counter for executed items

    // batch button
    var batchBtn = $('<a class="btn btn-small pull-right hidden-xs" id="azure-posting-batch" href="javascript:void(0);" data-in-batch="0">Batch</a>');
    batchBtn.on('click', function () {

        if ($(this).attr('data-in-batch') == '0') {
            _enterBatch();
        } else {
            _exitBatch();
        }
    });

    $('#hideSideNav').after(batchBtn);
}

/**
 * GENERAL
 * Extra scripts
 */
function postingExtra() {

    // CECA refused to change the label from "Country" to "Country / Region".
    // And their replied was very impatient and arrogant.
    // I guess they have no budget or intention to make this change.
    if ($('#mainContentDiv .orbisModuleHeader h1').text().match(/Advanced Search/)) {

        var label = $('label[class="control-label"][for="question_Country"]');
        if (!label.text().match(/Region/gi)) {
            label.html(label.html().replace(/Country/gi, 'Country / Region'));
        }

        var checkbox = $('div.checkboxGroup div.checkboxGroupBody');
        var checkItem;

        checkItem = checkbox.find('input[name="Country"][value="Hong Kong"]').first().parent();
        if (!checkItem.text().match(/China/gi))
            checkItem.html(checkItem.html().replace(/[^"]Hong Kong[^"]/, 'Hong Kong<span class="hidden">, China</span>'));

        checkItem = checkbox.find('input[name="Country"][value="Macao"]').first().parent();
        if (!checkItem.text().match(/China/gi))
            checkItem.html(checkItem.html().replace(/[^"]Macao[^"]/, 'Macao<span class="hidden">, China</span>'));

        checkItem = checkbox.find('input[name="Country"][value="Taiwan"]').first().parent();
        if (!checkItem.text().match(/China/gi))
            checkItem.html(checkItem.html().replace(/[^"]Taiwan[^"]/, 'Taiwan<span class="hidden">, China</span>'));
    }

    if ($('#postingDiv').length) {

        var itemTitles = $('#postingDiv table > tbody > tr > td:first-child');
        itemTitles.each(function () {
            if ($(this).text().match(/Country/gi) && !$(this).text().match(/Region/gi)) {
                $(this).html($(this).html().replace(/Country/gi, 'Country / Region'));
                var itemContent = $(this).next('td');
                var itemText = itemContent.text();
                if (!itemText.match(/China/gi) && false) {
                    if (itemText.match(/Hong Kong/gi)) {
                        itemContent.html(itemContent.html().replace(/Hong Kong/gi, 'Hong Kong, China'));
                    } else if (itemText.match(/Macao/gi)) {
                        itemContent.html(itemContent.html().replace(/Macao/gi, 'Macao, China'));
                    } else if (itemText.match(/Taiwan/gi)) {
                        itemContent.html(itemContent.html().replace(/Taiwan/gi, 'Taiwan, China'));
                    }
                }
                return false;
            }
        });
    }
}

/**
 * POSTING LIST
 * Optimization scripts for posting list
 * Runs every time an ajax request completes
 * @param table  The table itself
 * @param placeholder The content placeholder
 */
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

    if (options.JOB_ColumnDisplayType == 0) {
        // combine
        showColCSS += tableColumnCSS('.postingsTable', 5, {'display': 'none'});
        showColCSS += tableColumnCSS('.postingsTable', 6, {'display': 'none'});
    } else if (options.JOB_ColumnDisplayType == 1) {
        // waterlooworks default (customize display)
        var colCount = tableTh.length;
        var selectedCols = options.JOB_ColumnSelected;
        selectedCols = JSON.stringify(selectedCols);
        selectedCols = selectedCols.replace(/-/gi, ' ');
        selectedCols = JSON.parse(selectedCols);
        showColCSS += '.postingsTable>tbody>tr>td,.postingsTable>thead>tr>th{display:none}';
    } else if (options.JOB_ColumnDisplayType == 2) {
        // tile
        table.addClass('postingsTable-tile');
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
    if (options.JOB_FixTableHeader) {
        fixTableHeader(table);
        $(window).on('load', function () {
            setTimeout(function () {
                fixTableHeader(table);
            }, 500);
        });
    }

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
        var tags;
        if (options.JOB_ColumnDisplayType == 2) {
            tags = table.find('tbody tr span.label-inverse.new-tag');
        } else {
            tags = table.find('tbody tr td:nth-child(4) span.label-inverse');
        }

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
                blockPageMsg('Please wait');


                // get all onclick events
                var trs = table.find('tbody tr');
                var total = trs.length;
                var curr = 0;

                function _emptyShortlist() {
                    if (curr < total) {
                        setTimeout(function () {
                            evalToggleFavouritePosting($(trs[curr]).attr('data-shortlist'));
                            curr++;
                            blockPageMsg('Removing ' + curr + ' / ' + total);
                            _emptyShortlist();
                        }, 500);
                    } else {
                        unblockPage();
                    }
                }

                _emptyShortlist();

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
        if (options.JOB_ColumnDisplayType == 0) {
            jobTitleLink.after($('<p class="combined-info"><span class="organization">' + $(tr).children('td:nth-child(5)').text() + '</span><i class="icon-angle-right"></i><span class="division">' + $(tr).children('td:nth-child(6)').text() + '</span></p>'));
        } else if (options.JOB_ColumnDisplayType == 2) {
            $(tr).find('td:nth-child(5)').append('<span class="division"><i class="icon-angle-right"></i>' + $(tr).find('td:nth-child(6)').text().trim() + '</span>');
            $(tr).find('td:nth-child(4) span.label.label-inverse').addClass('new-tag').appendTo($(tr));
        }

        // click job title and open in new tab
        if (options.JOB_OpenInNewTab) {

            if (isBrowser('chrome') || isBrowser('safari') || isBrowser('opera')) {
                jobTitleLink.removeAttr('onclick').off('click');

                jobTitleLink.on('click', function (e) {

                    e.preventDefault();

                    if (e.which === 1) {
                        if ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.shiftKey))
                            evalBuildForm(currentTab);
                        else if (e.ctrlKey || e.metaKey)
                            window.open(location.href + '#' + encodeURIComponent(currentTab));
                        else
                            evalBuildForm(newTab);
                    }

                });

                // new tab link (deprecated)
                // jobTitleLink.after($('<a href="javascript:void(0);" class="view-in-new-tab-link" onclick="' + newTab + '"><i class="icon-external-link"></i><span> New Tab</span></a>'));

            } else if (isBrowser('firefox')) {
                jobTitleLink.removeAttr('onclick').off('click').attr('href', location.href + '#' + encodeURIComponent(currentTab));

                jobTitleLink.on('click', function (e) {
                    e.preventDefault();

                    if (e.which === 1) {
                        if (e.ctrlKey || e.metaKey)
                            evalBuildForm(currentTab);
                        else
                            evalBuildForm(newTab);
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
                if (notInterested !== null && notInterested !== undefined) {
                    var btnTxt = '';
                    if (isNotInterestedPage())
                        btnTxt = '<i class="icon-plus"></i> Include';
                    else
                        btnTxt = '<i class="icon-remove"></i> Not Interested';

                    contextMenuUtil('add', {
                        type: 'link',
                        code: btnTxt,
                        property: {
                            'href': 'javascript:void(0);',
                            'onclick': notInterested
                        }
                    });
                }


                // add line
                contextMenuUtil('add', {
                    type: 'html',
                    code: '<hr>'
                });

                // preview in modal
                if (options.JOB_PopupModal) {
                    contextMenuUtil('add', {
                        type: 'link',
                        code: '<i class="icon-globe"></i> Preview in Modal',
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
        if (typeof sizeTopScroll == 'function') {
            sizeTopScroll();
        }
    }, 100);
}

/**
 * POSTING LIST
 * Optimization scripts for posting list
 * Runs only once after page loaded
 */
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
            // fixTableHeader(table);
            $('#azure-hide-sidebar').trigger('click');
            $('#azure-hide-sidebar').trigger('click');
        }
    }, 300);

    injectCSS(baseURL + 'css/postings.css', 'head');
    // injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/postings.css', 'head');

    // coop
    if (currURL.match(/\/myAccount\/co-op\/coop-postings\.htm/gi))
        $('body').addClass('postings-coop');

    // grad / full-time
    else if (currURL.match(/\/myAccount\/hire-waterloo\/full-time-jobs\/jobs-postings\.htm/gi))
        $('body').addClass('postings-grad');

    // alumni
    else if (currURL.match(/\/myAccount\/hire-waterloo\/other-jobs\/jobs-postings\.htm/gi))
        $('body').addClass('postings-alumni');

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

    // batch operation
    if (options.JOB_ListBatchOperation)
        postingBatch();

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

/**
 * POSTING DETAILS
 * Optimization scripts for posting detail page
 * Runs only once after page loaded
 */
function postingDetail() {

    var divDetail = $('#postingDiv');
    if (!divDetail.length)
        return;

    if (options.GLB_ReverseTitleOrder)
        detailPageTitle();

    if (options.JOB_FloatDetailPageButton) {

        var actions = $('.orbis-posting-actions');

        if (actions.length) {

            // app btn text
            var appBtn = $('.applyButton');
            if (appBtn.text().trim().match(/I intend to/)) {
                appBtn.text('Intend To Apply').removeClass('btn-primary').addClass('btn-success');
            }

            actions.find('a.btn.btn-large').each(function (idx, elem) {
                if (typeof $(elem).attr('onclick') !== typeof undefined
                    && $(elem).attr('onclick').match(/toggleBlacklistPosting/)) {
                    $(elem).addClass('notInterestedButton');
                }
            });

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

            $('.notInterestedButton').on('click', function () {
                if ($(this).text().trim().match(/not interested/gi)) {
                    $('.notInterestedButton').text('Include in search results');
                } else {
                    $('.notInterestedButton').text('Not Interested');
                }
            });
        }


    }

    detailPageLinkNewTab(divDetail);

    if (options.JOB_DetailPageHighlight)
        highlightKeyword(divDetail, true);

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
        // var fontSize = 1.0;
        var fontSize = window.localStorage.getItem('azure-posting-detail-font-size');
        if (fontSize === null || !fontSize.match(/^[0-9]+\.[0-9]+$/g)) {
            fontSize = 1.0;
            window.localStorage.setItem('azure-posting-detail-font-size', fontSize.toString());
        } else {
            fontSize = Number(fontSize);
        }

        function _initFontSize() {
            panelTD.css({
                'font-size': fontSize + 'em',
                'line-height': (fontSize * 1.5) + 'em'
            });
        }

        _initFontSize();

        fontINC.on('click', function () {
            if (fontSize <= 1.5) {
                fontSize = fontSize + 0.1;
                window.localStorage.setItem('azure-posting-detail-font-size', fontSize.toString());
                _initFontSize();
            }
        });

        fontDEC.on('click', function () {
            if (fontSize >= 1.0) {
                fontSize = fontSize - 0.1;
                window.localStorage.setItem('azure-posting-detail-font-size', fontSize.toString());
                _initFontSize();
            }
        });

    }
}

/**
 * Start
 */
if (typeof jQuery !== typeof undefined) {
    if (typeof startAzureInject === 'function' && azureInjectReady === true) {
        postingList();
        postingDetail();
        postingExtra();
        removeOverlay();
    } else {
        var injectIntCnt = 0;
        var injectInt = setInterval(function () {
            if (typeof startAzureInject === 'function' && azureInjectReady === true) {
                clearInterval(injectInt);
                postingList();
                postingDetail();
                postingExtra();
                removeOverlay();
            } else if (injectIntCnt > 50) {
                clearInterval(injectInt);
                removeOverlay();
            }
            injectIntCnt++;
        }, 200);
    }
} else {
    document.querySelectorAll('.azure-load-cover').forEach(function (el) {
        el.remove();
    });
}
