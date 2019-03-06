/**
 * Scroll to
 * Automatically add the header height to the calculation
 * @param pos Scroll to position. Supports object / selector
 * @param time Scroll ani time
 * @param offset Scroll offset, optional
 */
function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    offset += themeConfigs.navbarHeight;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    if (isBrowser('safari'))
        $('body').animate({scrollTop: pos - offset}, time);
    else
        $('html').animate({scrollTop: pos - offset}, time);

}

/**
 * Block page
 * @param color Overlay color, optional
 * @param color Message, optional
 */
function blockPage(color, msg, time) {

    if ($('#azure-block-page').length)
        return;

    if (time === undefined || !Number.isInteger(time) || time == null || time === false)
        time = 300;

    var elem = $('<div class="azure-block-page" id="azure-block-page">');
    if (themeConfigs.brightness == 'dark')
        elem.addClass('azure-block-page-dark');

    if (color !== undefined)
        elem.css('background-color', color);
    if (msg === undefined)
        msg = '';

    $('<i class="icon-spinner icon-spin icon-3x"></i>').appendTo(elem);
    $('<div class="azure-block-page-msg">' + msg + '</div>').appendTo(elem);

    elem.hide().appendTo('body').fadeIn(time);

}

/**
 * Change block page message
 * @param msg
 */
function blockPageMsg(msg) {
    $('#azure-block-page').find('.azure-block-page-msg').html(msg);
}

/**
 * Unblock page
 */
function unblockPage(time) {

    if (time === undefined || !Number.isInteger(time) || time == null || time === false)
        time = 300;

    $('#azure-block-page').fadeOut(time, function () {
        $(this).remove();
    });

}

/**
 * Block element
 * @param elem
 */
function blockUI(elem, color, time, zindex) {

    elem.find('div.blockUI').remove();

    if (color === undefined || color == null || color === false)
        color = 'rgba(0,0,0,0.6)';

    if (time === undefined || !Number.isInteger(time) || time == null || time === false)
        time = 300;

    if (zindex === undefined || !Number.isInteger(zindex) || zindex == null || zindex === false)
        zindex = 1000;

    elem.css({
        'position': 'relative',
        'zoom': '1'
    });

    var base = $('<div class="blockUI" style="display:none"></div>');
    var overlay = $('<div class="blockUI blockOverlay" style="z-index: ' + zindex + '; border: none; margin: 0px; padding: 0px; width: 100%; height: 100%; top: 0px; left: 0px; background: ' + color + '; position: absolute;"></div>');
    overlay.hide();

    elem.append(base);
    elem.append(overlay);

    overlay.fadeIn(time);
}

/**
 * Unblock element
 * @param elem
 */
function unblockUI(elem, time) {

    if (time === undefined || !Number.isInteger(time) || time == null || time === false)
        time = 300;

    elem.find('div.blockOverlay').fadeOut(time, function () {
        elem.find('div.blockUI').remove().css({
            'position': 'static',
            'zoom': '1'
        });
    });
}

/**
 * Set cookie
 * @param key
 * @param value
 */
function setCookie(key, value, length) {
    var expires = new Date();
    if (Number.isInteger(length)) {
        expires.setTime(expires.getTime() + length);
    } else {
        expires.setTime(expires.getTime() + (86400 * 30));
    }
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

/**
 * Get cookie
 * @param key
 * @returns {null}
 */
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

/**
 * Test if an element's top is visible on screen
 * Automatically add the header height to the calculation
 * @param element
 * @returns {boolean}
 */
function isOnScreen(element) {

    var html;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    if ($.type(element) === 'object')
        return (html.scrollTop() + themeConfigs.navbarHeight < element.offset().top);
    else if ($.type(element) === 'number')
        return (html.scrollTop() + themeConfigs.navbarHeight < element);

    return true;
}

/**
 * Fix table header
 * Requires table to have <thead> element
 * If already run for a table, the next run will recalculate the width of header
 * @param table
 */
function fixTableHeader(table) {

    // if already executed, re-calculate header width
    var newTable = $('#' + table.attr('id') + '-thead');
    if (newTable.length) {
        newTable.attr('style', 'width:' + (table.width() + 1) + 'px; margin-left:' + table.offset().left + 'px; top:' + themeConfigs.navbarHeight + 'px;');
        return;
    }

    // clone table
    newTable = table.clone();

    // remove tbody
    newTable.children('tbody').remove();

    // change id to avoid conflicts
    newTable.attr('id', newTable.attr('id') + '-thead')
        .addClass('table-header-fixed hidden');

    // insert before current table
    newTable.insertBefore(table);

    // events
    $(window).on('scroll', function () {

        if (isOnScreen(table))
            newTable.addClass('hidden').removeClass('table-header-fixed');
        else
            newTable.addClass('table-header-fixed').removeClass('hidden');

    });

    // init fix header
    if (isOnScreen(table))
        newTable.addClass('hidden').removeClass('table-header-fixed');
    else
        newTable.addClass('table-header-fixed').removeClass('hidden');

    var tableLeft = table.offset().left;
    var tableWidth = table.width() + 1;
    newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px; top:' + themeConfigs.navbarHeight + 'px;');

    setTimeout(function () {
        tableLeft = table.offset().left;
        tableWidth = table.width() + 1;
        newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px; top:' + themeConfigs.navbarHeight + 'px;');
    }, 0);

    $(window).on('resize', function () {
        tableLeft = table.offset().left;
        tableWidth = table.width() + 1;
        newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px; top:' + themeConfigs.navbarHeight + 'px;');
    });

}

/**
 * Context menu
 * @param action 'create' / 'add' / 'show' / 'clear'
 * @param data. Object {type: 'link'/others, code: 'code'}
 */
function contextMenuUtil(action, data) {
    // action = create, add, show, clear
    if (action == 'create') {

        if ($('#azure-contextmenu').length)
            return;

        // context menu container
        var container = $('<div/>', {
            'class': 'azure-contextmenu azure-contextmenu-hidden',
            'id': 'azure-contextmenu'
        });

        // context menu item list
        var ulist = $('<ul/>', {
            'id': 'azure-contextmenu-list'
        });

        // disable right click on context menu
        ulist.contextmenu(function (e) {
            e.preventDefault();
        });

        container.append(ulist);

        // hide
        $('html').on('click', function (e) {

            if (!e.target.matches('#azure-contextmenu')) {
                $('#azure-contextmenu').addClass('azure-contextmenu-hidden');
            }

        });

        // add to body
        $('body').append(container);

    } else if (action == 'add') {

        if (data.type == 'link') {

            var elem = $('<a/>', data.property);
            elem.html(data.code);
            $('#azure-contextmenu-list').append($('<li/>').append(elem));

        } else {

            $('#azure-contextmenu-list').append($('<li/>').html(data.code));

        }

    } else if (action == 'show') {

        var winW = $(document).width(), winH = $(document).height();
        var cmW = $('#azure-contextmenu-list').width(), cmH = $('#azure-contextmenu-list').outerHeight();
        var showTop = 0, showLeft = 0;

        // detect h-overflow
        if (data.x + cmW + 20 > winW) {
            showLeft = data.x - cmW;
        } else {
            showLeft = data.x;
        }

        // detect v-overflow
        if (data.y + cmH + 20 > winH) {
            showTop = data.y - cmH;
        } else {
            showTop = data.y;
        }

        $('#azure-contextmenu-list').css({
            'top': showTop + 'px',
            'left': showLeft + 'px'
        });
        $('#azure-contextmenu').removeClass('azure-contextmenu-hidden');

    } else if (action == 'clear') {

        $('#azure-contextmenu-list').empty();

    }
}

/**
 * Create button
 * @param text Button display text
 * @param type Tag name. E.g. a or button
 * @param prop Obj of attributes [class:'', id:'' ...]
 * @returns {*|jQuery|HTMLElement}
 */
function buttonCreateUtil(text, type, prop) {
    var btn = $('<' + type + '>' + text + '</' + type + '>');
    $.each(prop, function (k, v) {
        btn.attr(k, v);
    });
    return btn;
}

/**
 * Reverse title order
 */
function reverseTitleOrder() {

    var titleTag = $('head').children('title');
    var titleText = titleTag.text();
    var titleArr = titleText.split(' - ');

    titleArr.reverse();
    titleText = titleArr.join(' - ');
    titleTag.text(titleText);

}

/**
 * New azure homepage
 */
function replaceHomepage() {

    if (isBrowser('safari')) {
        function replaceHomepageAjax(data) {

            // find notice
            var notice = $('table').clone();

            $('body').html(data);

            // modify notice
            if (notice !== null && notice !== undefined) {

                $('<a href="javascript:void(0);" class="close-notice"><i class="icon-remove-sign"></i></a>')
                    .on('click', function (e) {
                        e.preventDefault();
                        notice.remove();
                    })
                    .appendTo(notice.find('tbody tr'));

                $('body').append(notice);
            }
        }

        $.ajax({
            url: baseURL + 'theme/theme_' + options.GLB_ThemeID + '/homepage.html',
            dataType: 'html',
            success: function (data) {

                replaceHomepageAjax(data.responseText);

            },
            error: function (data) {

                replaceHomepageAjax(data.responseText);

            }
        });
    } else {
        // find notice
        var notice = $('table').clone();

        // replace body
        $.get(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/homepage.html', function (data) {

            $('body').html(data);

            // modify notice
            if (notice !== null && notice !== undefined) {

                $('<a href="javascript:void(0);" class="close-notice"><i class="icon-remove-sign"></i></a>')
                    .on('click', function (e) {
                        e.preventDefault();
                        notice.remove();
                    })
                    .appendTo(notice.find('tbody tr'));

                $('body').append(notice);
            }
        });

    }

}

/**
 * Back to top button
 */
function addBackToTopButton() {

    $(window).on('scroll', function () {

        if ($(this).scrollTop() < 100)
            $('#azure-back-to-top').addClass('azure-back-to-top-hidden').delay(200);
        else
            $('#azure-back-to-top').removeClass('azure-back-to-top-hidden');

    });

    $('<div/>', {
        'class': 'azure-back-to-top azure-back-to-top-hidden',
        'id': 'azure-back-to-top',
        click: function (e) {
            scrollToUtil(0, 400);
        }
    }).appendTo('body');

}

/**
 * Table column css generator
 * @param selector
 * @param colID The index of nth-child css
 * @param obj Css properties
 * @returns {string}
 */
function tableColumnCSS(selector, colID, obj) {

    var css = selector + '>tbody>tr>td:nth-child(' + colID + '),'
        + selector + '>thead>tr>th:nth-child(' + colID + '){';

    for (var key in obj) {
        css += key + ':' + obj[key] + ';';
    }
    css += '}';

    return css;
}

/**
 * Hide / show appointments introduction
 */
function apptHideInstr() {

    var headText = $('#mainContentDiv h1').text();

    // other appt page
    if (!headText.match(/Appointments/) && !headText.match(/Book by/)) return;

    // appt guide page
    else if (headText.match(/Appointments/) && !headText.match(/Book by/)) {

        var boxes = $('#mainContentDiv > .box');
        boxes.css('position', 'relative');

        var termBox = boxes.first();
        var btnBox = boxes.last();

        // fold terms
        if (options.APPT_AutoFoldTerm) {
            termBox.addClass('azure-appt-intro-collapsed');
            var expandBtn = $('<div class="azure-appt-intro-expand-btn">Expand <i class="icon-angle-down"></i></div>');
            expandBtn.on('click', function (e) {
                if ($(this).hasClass('azure-appt-intro-expand-btn')) {
                    $(this).removeClass('azure-appt-intro-expand-btn')
                        .addClass('azure-appt-intro-collapse-btn')
                        .html('Collapse <i class="icon-angle-up"></i>');
                    termBox.removeClass('azure-appt-intro-collapsed').addClass('azure-appt-intro-expanded');
                } else {
                    $(this).removeClass('azure-appt-intro-collapse-btn')
                        .addClass('azure-appt-intro-expand-btn')
                        .html('Expand <i class="icon-angle-down"></i>');
                    termBox.addClass('azure-appt-intro-collapsed').removeClass('azure-appt-intro-expanded');
                }
            });
            termBox.append(expandBtn);
        }

        // swtich appt box and terms box
        if (options.APPT_SwitchTermAndLink) {
            termBox.insertAfter(btnBox);
        }

        // auto enter appt book page if only one opt available
        if (options.APPT_AutoEnterBookPage) {
            var apptLink = btnBox.find('a');
            if (apptLink.length === 1) apptLink.trigger('click');
        }
    }

    // appt book page
    else if (headText.match(/Appointments/) && headText.match(/Book by/)) {

        // auto hide type intro
        if (options.APPT_AutoHideTypeIntro) {
            var introRow = $('#mainContentDiv').children('.row-fluid').find('.span6:first-child .row:nth-child(2) .box .boxContent .row');
            introRow.each(function (idx, elem) {
                var introDiv = $(elem).find('div:last-child');
                // introDiv.attr('data-org-height', introDiv.height() + 'px');
                introDiv.on('click', function (e) {
                    e.preventDefault();
                    $(elem).removeClass('azure-appt-type-auto-hide');
                });
            });
            introRow.addClass('azure-appt-type-auto-hide');
        }
    }

}

/**
 * Custom font css
 */
function customFont() {

    var fontConf = options.GLB_FontName.split('||');
    var largerFontSizeExtra = 2;
    // fontName||weights||fontSize||source
    if (fontConf.length == 4) {

        // name, weights, size, source
        if (fontConf[3] == 'google') {
            injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');
        } else if (fontConf[3] == 'none') {

        } else {
            injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');
        }

        if (options.GLB_LargerFont)
            fontConf[2] = parseInt(fontConf[2]) + largerFontSizeExtra;

        injectCSS('body{font-size:' + fontConf[2] + 'px}', 'head', 'text');

    } else if (fontConf.length == 3) {

        // name, weights, size
        injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':' + fontConf[1], 'head');

        if (options.GLB_LargerFont)
            fontConf[2] = parseInt(fontConf[2]) + largerFontSizeExtra;

        injectCSS('body{font-size:' + fontConf[2] + 'px}', 'head', 'text');

    } else {

        // name only
        injectCSS('//fonts.googleapis.com/css?family=' + fontConf[0].replace(/ /g, '+') + ':400,600,800', 'head');

        if (options.GLB_LargerFont)
            injectCSS('body{font-size:' + (12 + largerFontSizeExtra) + 'px}', 'head', 'text');

    }

    var lineHeightLargerCSS = '', bodyLineHeightLargerCSS = '';
    if (options.GLB_LargerFont) {
        lineHeightLargerCSS = '.table th,.table td,strong{line-height: 1.5em;}';
        bodyLineHeightLargerCSS = 'line-height:normal;';
    }

    injectCSS('body, strong, p, a, h1, h2, h3, h4, h5, h6, input, button, select {font-family: \'' + fontConf[0] + '\', "Microsoft YaHei", sans-serif !important;' + bodyLineHeightLargerCSS + '}' + lineHeightLargerCSS, 'head', 'text');

}

/**
 * Initialization
 */
function startAzure() {

    if (!options.GLB_Enabled)
        return;

    // title order
    if (options.GLB_ReverseTitleOrder)
        reverseTitleOrder();

    // favicon
    $('head link[type="image/x-icon"]').attr('href', baseURL + 'icon/icon32.png');

    // student
    if (currURL.match(/\/myAccount\//i)) {

        // grad & alumni guide page
        if (currURL.match(/\/myAccount\/hire-waterloo\/overview\.htm/i)) {
            $('#mainContentDiv').find('.boxContent a').addClass('btn btn-primary azure-grad-guide-link');
        }

        // dashboard
        if (currURL.match(/\/myAccount\/dashboard\.htm/i)) {
            // add fade effect to open modal buttons
            $('#uploadDocument, #createApplicationPackage, #searchPostings').addClass('fade');

            // is Home
            if ($('#displayOverview').hasClass('active')) {
                // body class
                $('body').addClass('dashboard-home');
                // announcement css
                $('#mainContentDiv > div.orbisTabContainer > div.tab-content > div:nth-child(2) > div:nth-child(1) > div.row-fluid > div span').removeAttr('style');
            }

            // campus connect
            if (options.DASH_HideCampusConnectBadge)
                $('#displayStudentCampusLink').addClass('hideBadge');

            if (options.DASH_HideCampusConnect)
                $('#displayStudentCampusLink').addClass('hidden');

            // float dashboard buttons
            var headerText = $('.orbisModuleHeader').text();
            if ($('.messageView').length
                || headerText.match(/Send A Message/)
                || headerText.match(/Submit A Form/)
                || headerText.match(/Form Details/)) {
            } else {
                // not msg view / submit form
                $('#mainContentDiv .orbis-posting-actions:first').addClass('azure-dashboard-action-btn');
            }

        } else if (currURL.match(/\/appointments\.htm/) || currURL.match(/\/appointments-further-education\.htm/)) {
            apptHideInstr();
        }

    }

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    // remove cover
    var hash = decodeURI(window.location.hash);
    if (currURL.match(/\/coop-postings\.htm/) || currURL.match(/\/jobs-postings\.htm/)) {

    } else {
        $('#azure-body-hide').remove();
        $('#azure-load-cover').delay(300).fadeOut(300, function () {
            $('#azure-load-cover').remove();
        });
    }

}
