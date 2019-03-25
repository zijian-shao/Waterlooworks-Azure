/**
 * Inject css
 * @param url Css text if type = 'text'; otherwise href url
 * @param tag Inject to target tag
 * @param type 'text' or others, optional
 */
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

/**
 * Inject JS
 * @param url JS text if type = 'text'; otherwise src url
 * @param tag Inject to target tag
 * @param type 'text' or others, optional
 */
function injectJS(url, tag, type, attr) {

    var script = $('<script/>', {
        'type': 'text/javascript'
    });

    if (type === 'text') {
        script.text(url);
    } else {
        script.attr('src', url);
    }

    if (typeof attr != typeof undefined) {
        script.attr(attr);
    }

    $(tag).append(script);

}

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

function removeOverlay(forcible) {
    if (forcible === true) {
        $('.azure-load-cover').remove();
    } else {
        setTimeout(function () {
            $('#azure-load-cover').on('webkitTransitionEnd transitionend', function (e) {
                $(this).remove();
            }).addClass('azure-load-cover-hide');
        }, 200);
    }
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

function evalBuildForm(str, overrideTarget, needSubmit) {
    if (str.match(/orbisApp\.buildForm\(.*\)\.submit/g)) {
        if (typeof orbisApp.buildForm === 'function') {
            str = str.replace(/ /g, '').replace(/orbisApp\.buildForm\(/g, '').replace(/\)\.submit\(\);/g, '');
            str = str.replace(/'/g, '"').replace(/([a-zA-Z0-9\-_]+):/g, "\"$1\":");
            str = '[' + str + ']';
            str = JSON.parse(str);

            if (str[1] == '') {
                str[1] = window.location.href.split('#')[0];
            }

            if (typeof overrideTarget !== typeof undefined) {
                str[2] = overrideTarget;
            }

            var theForm = orbisApp.buildForm(str[0], str[1], str[2]);
            if (needSubmit !== false) {
                theForm.submit();
            }

            return theForm;
        } else {
            alert('ERROR: orbisApp.buildForm function does not exist! Please report this issue to the extension developer. Thank you.');
            return false;
        }
    } else {
        alert('ERROR: orbisApp.buildForm function has been renamed! Please report this issue to the extension developer. Thank you.');
        return false;
    }
}

function evalToggleBlacklistPosting(str) {
    if (str.match(/toggleBlacklistPosting/g)) {
        if (typeof toggleBlacklistPosting === 'function') {
            str = str.trim().replace(/ /g, '').replace(/toggleBlacklistPosting\(this,/g, '').replace(/\)/g, '');
            toggleBlacklistPosting(null, Number(str));
            return true;
        } else {
            alert('ERROR: toggleBlacklistPosting function does not exist! Please report this issue to the extension developer. Thank you.');
            return false;
        }
    } else {
        alert('ERROR: toggleBlacklistPosting function has been renamed! Please report this issue to the extension developer. Thank you.');
        return false;
    }
}

function evalToggleFavouritePosting(str) {
    if (str.match(/toggleFavouritePosting/g)) {
        if (typeof toggleFavouritePosting === 'function') {
            str = str.trim().replace(/ /g, '').replace(/toggleFavouritePosting\(this,/g, '').replace(/\)/g, '').replace(/'/g, '"');
            str = '[' + str + ']';
            str = JSON.parse(str);
            toggleFavouritePosting(null, str[0], str[1], str[2], str[3], str[4], str[5], str[6]);
            return true;
        } else {
            alert('ERROR: toggleFavouritePosting function does not exist! Please report this issue to the extension developer. Thank you.');
            return false;
        }
    } else {
        alert('ERROR: toggleFavouritePosting function has been renamed! Please report this issue to the extension developer. Thank you.');
        return false;
    }
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
 * Test current browser type
 * @param name Supports: opera, firefox, safari, ie, edge, chrome
 * @returns {boolean}
 */
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
        return /chrome/.test(navigator.userAgent.toLowerCase());
    else
        return false;
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
 * Remove one level of nested panels on dashboard
 */
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

function startAzureInject() {

    if (typeof jQuery === typeof undefined) return;

    // dashboard nested boxes
    if (currURL.match(/\/myAccount\/dashboard\.htm/i)) {
        if ($('#displayOverview').hasClass('active')) {
            dashboardNestedBoxes();
        }
    }

    // keep logged in
    if (options.GLB_KeepLoggedIn) {
        if (typeof keepMeLoggedInClicked === 'function') {
            setInterval(function () {
                keepMeLoggedInClicked();
            }, 1700 * 1000);
        }
    }
}

startAzureInject();