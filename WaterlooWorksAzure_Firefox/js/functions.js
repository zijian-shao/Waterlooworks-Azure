function injectCSS(url, tag, type) {

    var style;

    if (type === 'text') {

        style = $('<style/>');

        style.text(url);

    } else {

        style = $('<link/>', {
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': url
        });

    }

    $(tag).append(style);

}

function injectJS(url, tag, type) {

    var script = $('<script/>', {
        'type': 'text/javascript'
    });

    if (type === 'text') {
        script.text(url);
    } else {
        script.attr('src', url);
    }

    $(tag).append(script);

}

function scrollToUtil(pos, time, offset) {

    if ($.type(offset) !== 'number')
        offset = 0;

    offset += themeConfig.navbarHeight;

    if ($.type(pos) === 'object')
        pos = pos.offset().top;
    else if ($.type(pos) === 'string')
        pos = $(pos).first().offset().top;

    if (isBrowser('safari'))
        $('body').animate({scrollTop: pos - offset}, time);
    else
        $('html').animate({scrollTop: pos - offset}, time);

}

function blockPage(color) {

    var elem = $('<div/>', {
        'id': 'azure-block-page',
        'class': 'azure-block-page'
    });
    if (themeConfig.brightness == 'dark')
        elem.addClass('azure-block-page-dark');

    if (color !== undefined)
        elem.css('background-color', color);

    elem.append($('<i class="icon-spinner icon-spin icon-3x"></i>')).hide().appendTo('body').fadeIn(300);

}

function unblockPage() {

    $('#azure-block-page').fadeOut(300, function () {
        $(this).remove();
    });

}

function isOnScreen(element) {

    var html;
    if (isBrowser('safari'))
        html = $('body');
    else
        html = $('html');

    if ($.type(element) === 'object')
        return (html.scrollTop() + themeConfig.navbarHeight < element.offset().top);
    else if ($.type(element) === 'number')
        return (html.scrollTop() + themeConfig.navbarHeight < element);

    return true;
}

function isBrowser(name) {
    name = name.toLowerCase();
    if (name == 'opera')
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    else if (name == 'firefox')
        return typeof InstallTrigger !== 'undefined';
    else if (name == 'safari')
        return /constructor/i.test(window.HTMLElement) || (function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    else if (name == 'ie')
        return /*@cc_on!@*/false || !!document.documentMode;
    else if (name == 'edge')
        return !isIE && !!window.StyleMedia;
    else if (name == 'chrome')
        return !!window.chrome && !!window.chrome.webstore;
    else
        return false;
}

function getParaArr(str) {

    str = str.replace(/ /g, '');
    str = str.substring(str.indexOf('(') + 1);
    str = str.replace(/\)/g, '').replace(/'/g, '"');
    str = '[' + str + ']';
    str = JSON.parse(str);

    return str;

}

function fixTableHeader(table) {

    // if already executed, re-calculate header width
    var newTable = $('#' + table.attr('id') + '-thead');
    if (newTable.length) {
        newTable.attr('style', 'width:' + (table.width() + 1) + 'px; margin-left:' + table.offset().left + 'px;');
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
    newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px;');

    setTimeout(function () {
        tableLeft = table.offset().left;
        tableWidth = table.width() + 1;
        newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px;');
    }, 0);

    $(window).on('resize', function () {
        tableLeft = table.offset().left;
        tableWidth = table.width() + 1;
        newTable.attr('style', 'width:' + tableWidth + 'px; margin-left:' + tableLeft + 'px;');
    });

}


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

            if (!e.target.matches('#azure-contextmenu'))
                $('#azure-contextmenu').addClass('azure-contextmenu-hidden');

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

        $('#azure-contextmenu-list').attr('style', 'top:' + data.y + 'px; left:' + data.x + 'px');
        $('#azure-contextmenu').removeClass('azure-contextmenu-hidden');

    } else if (action == 'clear') {

        $('#azure-contextmenu-list').empty();

    }
}

function buttonCreateUtil(text, type, prop) {
    var btn = $('<' + type + '>' + text + '</' + type + '>');
    $.each(prop, function (k, v) {
        btn.attr(k, v);
    });
    return btn;
}

function reverseTitleOrder() {

    var titleTag = $('head').children('title');
    var titleText = titleTag.text();
    var titleArr = titleText.split(' - ');

    titleArr.reverse();
    titleText = titleArr.join(' - ');
    titleTag.text(titleText);

}

function needBuildForm() {

    // detect hash and execute as js
    var hash = decodeURI(window.location.hash);

    if (hash.match(/#orbisApp\.buildForm\(.*\)\.submit\(\);/gi)) {
        window.location.hash = '';
        eval(hash.replace(/#/g, ''));
        return true;
    } else {
        return false;
    }

}

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

function tableColumnCSS(selector, colID, obj) {

    var css = selector + '>tbody>tr>td:nth-child(' + colID + '),'
        + selector + '>thead>tr>th:nth-child(' + colID + '){';

    for (var key in obj) {
        css += key + ':' + obj[key] + ';';
    }
    css += '}';

    return css;
}

function dashboardNestedBoxes() {

    $(document).ajaxComplete(function (event, xhr, settings) {

        if (settings.url === 'https://waterlooworks.uwaterloo.ca/myAccount/dashboard.htm'
            && settings.dataType === 'html') {

            if (xhr.responseText.match(/Term:/)) {

                // remove nested panel
                $('.panel-default').each(function (index, element) {

                    var panelHeading = $(element).children('.panel-heading');

                    if (panelHeading.text().match(/Co-op([\s\S]*)Sequence([\s\S]*)Summary/i)) {

                        var panelBody = $(element).find('div[id^="orbisAjaxPlaceholder"]').detach();
                        panelBody.children('br').remove();
                        $('div[class^="serviceTeamMembersContainer"]').after(panelBody);
                        $(element).addClass('hidden');
                    }

                    if (panelHeading.text().match(/Service([\s\S]*)Team/i)) {
                        panelHeading.find('i').remove();
                    }
                });
            }
        }
    });
}

function startAzure() {

    // redirect page
    if (needBuildForm())
        return;

    // title order
    if (options.GLB_ReverseTitleOrder)
        reverseTitleOrder();

    // favicon
    $('head link[type="image/x-icon"]').attr('href', baseURL + 'icon/icon32.png');

    // font
    injectCSS('//fonts.googleapis.com/css?family=' + options.GLB_FontName.replace(/ /g, '+') + ':400,600,800', 'head');
    injectCSS('body, strong, p, a, h1, h2, h3, h4, h5, h6, input, button, select {font-family: \'' + options.GLB_FontName + '\', "Microsoft YaHei", sans-serif !important;}', 'head', 'text');

    // cache current url
    var currURL = window.location.href;

    // inject global css
    injectCSS(baseURL + 'css/common.css', 'head');

    // student
    if (currURL.match(/\/myAccount\//i)) {

        injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');

        // grad & alumni guide page
        if (currURL.match(/\/myAccount\/hire-waterloo\/overview\.htm/i)) {
            $('#mainContentDiv').find('.boxContent a').addClass('btn btn-primary azure-grad-guide-link');
        }

        // dashboard
        if (currURL.match(/\/myAccount\/dashboard\.htm/i)) {
            // add fade effect to open modal buttons
            $('#uploadDocument, #createApplicationPackage, #searchPostings').addClass('fade');
            dashboardNestedBoxes();
        }

        // extra functions
        if (currURL.match(/\/myAccount\/dashboard\.htm/i))
            injectJS(baseURL + 'js/messages.js', 'head');
        if (currURL.match(/\/jobs-postings\.htm/i) || currURL.match(/\/coop-postings\.htm/))
            injectJS(baseURL + 'js/postings.js', 'head');
    }

    // homepage page
    else if (currURL.match(/\/home\.htm/)) {
        if (options.GLB_ReplaceLoginPage) {
            injectCSS(baseURL + 'css/homepage.css', 'head');
            replaceHomepage();
        }
    }

    // employer page
    else if (currURL.match(/\/employer\//)) {
        injectCSS(baseURL + 'theme/theme_0/common.css', 'head');
        injectCSS(baseURL + 'css/employer.css', 'head');
    }

    // back to top button
    if (options.GLB_BackToTopButton) {
        addBackToTopButton();
    }

    // keep logged in
    if (options.GLB_KeepLoggedIn) {
        if (typeof keepMeLoggedInClicked == 'function') {
            setInterval(function () {
                keepMeLoggedInClicked();
            }, 1700 * 1000);
        }
    }

    // remove cover
    $('#azure-load-cover').delay(200).fadeOut(400, function () {
        $('#azure-load-cover').remove();
    });

}

var hideNewTagStatus = false, hideShortlistedStatus = false;

startAzure();
