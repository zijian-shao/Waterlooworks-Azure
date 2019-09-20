function initOptions() {

    function getFeedbackLink() {
        function _getOS() {
            var OSName = "Unknown";
            if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
            if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
            if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
            if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
            if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
            if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
            if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
            if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
            if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
            return OSName;
        }

        function _getBrowser() {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE ', version: (tem[1] || '')};
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) return {name: 'Opera', version: tem[1]};
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return {name: M[0], version: M[1]};
        }

        var urlTpl = getLink('feedback');
        urlTpl = urlTpl.replace('@@extVersion@@', encodeURI(browser.runtime.getManifest().version));
        urlTpl = urlTpl.replace('@@browser@@', encodeURI(_getBrowser().name + ' ' + _getBrowser().version));
        urlTpl = urlTpl.replace('@@os@@', encodeURI(_getOS()));

        return urlTpl;
    }

    function createItemTag(optName, optVal, parentID, save) {

        var itemTag = $('<div class="item-tag" data-option-name="' + optName + '" data-option-value="' + optVal + '">' + optVal + '<div class="item-tag-remove">X</div></div>');
        itemTag.hide().appendTo($('#' + parentID)).fadeIn(200, function () {
            itemTag.find('.item-tag-remove').on('click', function () {
                $(this).prop('disabled', true);
                onTagOptionChange(itemTag);
                itemTag.fadeOut(200, function () {
                    itemTag.remove();
                });
            });
            if (save === true)
                onTagOptionChange(itemTag, true);
        });
    }

    function initPopup(title, content, extraClass, type) {
        $('body').addClass('lock-scroll');
        var rnd = Math.floor(Math.random() * 90000) + 10000;
        var content2;
        if (type === 1)
            content2 = content;
        else
            content2 = content.next('.popup-template').first().children().clone();
        if (extraClass === undefined) extraClass = '';

        var template = $('<div class="popup popup-' + rnd + ' ' + extraClass + '">' +
            '<div class="popup-layer"></div>' +
            '<div class="popup-container">' +
            '<div class="popup-frame">' +
            '<div class="popup-title"></div>' +
            '<div class="popup-content"></div>' +
            '</div>' +
            '</div>' +
            '</div>');
        template.find('.popup-title').html(title);
        template.find('.popup-content').html(content2);
        template.appendTo('body');
        template.addClass('popup-show');
        template.find('.popup-layer').addClass('fadeIn animated');
        template.find('.popup-frame').addClass('bounceIn animated');
        return 'popup-' + rnd;
    }

    function removePopup(cls) {
        $('.' + cls).remove();
        if (!$('.popup').length) $('body').removeClass('lock-scroll');
    }

    function getSearchParameters() {

        // stack overflow 5448545
        function _transformToAssocArray(prmstr) {
            var params = {};
            var prmarr = prmstr.split("&");
            for (var i = 0; i < prmarr.length; i++) {
                var tmparr = prmarr[i].split("=");
                params[tmparr[0]] = tmparr[1];
            }
            return params;
        }

        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? _transformToAssocArray(prmstr) : {};
    }

    function removeSearchParameters(sParam) {
        var url = window.location.href.split('?')[0] + '?';
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] != sParam) {
                url = url + sParameterName[0] + '=' + sParameterName[1] + '&'
            }
        }
        return url.substring(0, url.length - 1);
    }

    function restoreOptions() {

        var configs = getOptionListDefault();

        browser.storage.sync.get(configs, function (items) {

            var optionElem;

            for (var key in items) {

                optionElem = $('input[data-option-name="' + key + '"]');

                switch (key) {

                    case 'JOB_ColumnDisplayType':
                    case 'GLB_ThemeID':
                    case 'GLB_FontName':
                        var hasFound = false;
                        if (items[key] === true) {
                            optionElem.first().prop('checked', true);
                            hasFound = true;
                        } else {
                            if (key == 'GLB_FontName') {
                                items[key] = items[key].split('||');
                                items[key] = items[key][0];
                            }
                            optionElem.each(function (index, element) {
                                if ($(element).attr('value') == items[key]) {
                                    $(element).prop('checked', true);
                                    hasFound = true;
                                }
                            });
                        }
                        if (!hasFound) {
                            optionElem.first().prop('checked', true);
                        }
                        break;

                    case 'JOB_ColumnSelected':
                        if (items[key] === true) {
                            optionElem.each(function (index, element) {
                                $(element).prop('checked', true);
                            });
                        } else {
                            // var arr = JSON.parse(items[key]);
                            var arr = items[key];
                            for (var i = 0, len = arr.length; i < len; i++) {
                                optionElem.each(function (index, element) {
                                    if ($(element).attr('name') == arr[i].toLowerCase()) {
                                        $(element).prop('checked', true);
                                    }
                                });
                            }
                        }
                        break;

                    case 'JOB_PopupModalRows':
                        var popupModalList = $('#popupModalList');
                        for (var i = 0, len = Object.keys(items[key]).length; i < len; i++) {
                            var checked = '', disabled = '';
                            var name = items[key]['row_' + i]['name'];
                            var display = items[key]['row_' + i]['display'];
                            var arrows = '';
                            if (name.match(/job title/i) || name.match(/organization/i))
                                disabled = 'disabled';
                            if (display)
                                checked = 'checked';
                            if (!disabled)
                                arrows = '<div class="sort-arrows"><div class="arrow up"></div><div class="arrow down"></div></div>';

                            var mRowItem = $('<div class="checkbox-item"><div class="checkbox-square ' + disabled + '"><input type="checkbox" id="opt-job-5-' + i + '" data-option-name="JOB_PopupModalRows" data-option-value="' + name + '" data-option-type="item2" ' + checked + ' ' + disabled + '><label for="opt-job-5-' + i + '"></label></div>' + arrows + '<label for="opt-job-5-' + i + '" class="checkbox-label ' + disabled + '">' + name + '</label></div>');

                            mRowItem.find('.arrow.up').first().on('click', function (e) {
                                var parent = $(this).closest('div.checkbox-item');
                                var prev = parent.prev('div.checkbox-item');
                                if (prev.length && !prev.find('input').prop('disabled')) {
                                    prev.addClass('slide-down').fadeOut(200);
                                    parent.addClass('slide-up').fadeOut(200, function () {
                                        parent.removeClass('slide-up').insertBefore(prev).fadeIn(200);
                                        prev.removeClass('slide-down').fadeIn(200);
                                        onOptionChange(parent.find('input'));
                                    });
                                }
                            });
                            mRowItem.find('.arrow.down').first().on('click', function (e) {
                                var parent = $(this).closest('div.checkbox-item');
                                var next = parent.next('div.checkbox-item');
                                if (next.length && !next.find('input').prop('disabled')) {
                                    next.addClass('slide-up').fadeOut(200);
                                    parent.addClass('slide-down').fadeOut(200, function () {
                                        parent.removeClass('slide-down').insertAfter(next).fadeIn(200);
                                        next.removeClass('slide-up').fadeIn(200);
                                        onOptionChange(parent.find('input'));
                                    });
                                }
                            });
                            popupModalList.append(mRowItem);
                        }
                        break;

                    case 'JOB_DetailPageHighlightKeywords':
                        var hlKwList = $('#highlightKeywordList');

                        for (var i = 0, len = items[key].length; i < len; i++) {
                            createItemTag('JOB_DetailPageHighlightKeywords', items[key][i], 'highlightKeywordList');
                        }

                        break;

                    default:
                        optionElem.prop('checked', items[key]);
                }

            }

            if (items.JOB_ColumnDisplayType == 1)
                $('#columnsList').show();
            else
                $('#columnsList').hide();

            bindEvents();
        });

    }

    function saveOption(obj, callback) {

        browser.storage.sync.set(obj, function () {

            $('#azure-toast').removeClass('azure-toast-hidden');

            window.clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $('#azure-toast').addClass('azure-toast-hidden');
            }, 1000);

            if ($.type(callback) === 'function') {
                callback();
            }
        });
    }

    function onTagOptionChange(elem, saveAll) {
        var optName = elem.attr('data-option-name');
        var optVal = elem.attr('data-option-value');
        if (saveAll !== true) saveAll = false;

        var contentArr = [];
        $('div[data-option-name="' + optName + '"]').each(function (index, element) {
            if (saveAll)
                contentArr.push($(element).attr('data-option-value'));
            else if ($(element).attr('data-option-value') != optVal)
                contentArr.push($(element).attr('data-option-value'));
        });

        var obj = {};
        obj[optName] = contentArr;
        saveOption(obj);

    }

    function onOptionChange(elem) {
        var inputType = elem.attr('type');
        var optType = elem.attr('data-option-type');
        var optName = elem.attr('data-option-name');
        var optVal = elem.attr('data-option-value');

        if (optName === undefined) return;

        if (inputType == 'checkbox') {

            switch (optType) {

                // simple switch, save as boolean
                case 'switch':

                    var obj = {};
                    obj[optName] = elem.is(':checked');
                    saveOption(obj);

                    break;

                // list of items, save as array string
                case 'item':

                    var contentArr = [];

                    $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                        if ($(element).is(':checked')) {
                            contentArr.push($(element).attr('name'));
                        }
                    });

                    var obj = {};
                    obj[optName] = contentArr;
                    saveOption(obj);

                    break;

                case 'item2':

                    var contentObj = {};
                    $('input[data-option-name="' + optName + '"]').each(function (index, element) {
                        contentObj['row_' + index] = {
                            'name': $(element).attr('data-option-value'),
                            'display': $(element).is(':checked')
                        };
                    });

                    var obj = {};
                    obj[optName] = contentObj;
                    saveOption(obj);

                    break;

                default:

            }
        } else if (inputType == 'radio') {

            switch (optType) {
                // save "value" attr of the radio
                case 'enum':

                    var obj = {};
                    obj[optName] = elem.attr('value');
                    saveOption(obj);

                    break;

                // font
                case 'enum2':
                    var obj = {};
                    obj[optName] = elem.attr('value') + '||' + elem.attr('data-font-weight') + '||' + elem.attr('data-font-size');
                    var fontSrc = elem.attr('data-font-source');
                    if (typeof fontSrc !== typeof undefined && fontSrc !== false) {
                        obj[optName] = obj[optName] + '||' + fontSrc;
                    }
                    saveOption(obj);
                    break;
            }
        }
    }

    function onHashChange() {
        var hash = window.location.hash.substring(1);
        if (!hash.length) hash = 'global';
        $('li[data-option-tab-name = "' + hash + '"]').trigger('click');
    }

    function bindEvents() {

        var params = getSearchParameters();

        // event
        $('input').on('change', function () {
            onOptionChange($(this));
        });

        $('#add-highlight-keyword-btn').on('click', function () {
            var val = $('#add-highlight-keyword-input').val();
            $('#add-highlight-keyword-input').val('');

            val = val.trim();
            if (val == '' || val.length < 1 || val.length > 30) return;

            createItemTag('JOB_DetailPageHighlightKeywords', val, 'highlightKeywordList', true);

        });

        $('#add-highlight-keyword-input').on('keydown', function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13) {
                $('#add-highlight-keyword-btn').trigger('click');
            }
        });

        // switch between tabs
        $('.nav-tab').on('click', function () {

            if ($(this).hasClass('active'))
                return;

            var prevTabID = $('li.nav-tab.active').attr('data-option-tab-index');
            var thisTabID = $(this).attr('data-option-tab-index');

            $('#nav-tab-' + prevTabID).removeClass('active');
            $(this).addClass('active');

            $('#opt-tab-' + prevTabID).fadeOut(200, function () {
                $('#opt-tab-' + prevTabID).addClass('hidden');
                $('#opt-tab-' + thisTabID).fadeIn(200).removeClass('hidden');
            });

            window.location.hash = $(this).attr('data-option-tab-name');

        });

        // auto switch tab
        onHashChange();

        // toggle tips
        $('.option-tip-toggle').on('click', function () {

            $(this).parents('div.option-group').children('div.option-tip').toggleClass('hidden');

        });

        // column list
        $('input[name="JOB_ColumnDisplayType"]').on('change', function () {

            if ($(this).val() == 1)
                $('#columnsList').show();

            else
                $('#columnsList').hide();

        });

        // restore popup modal rows
        $('#restore-popup-modal-rows').on('click', function (e) {
            e.preventDefault();
            var r = confirm($('#restore-popup-modal-rows-confirm-text').text());
            if (r == true) {
                var tmpObj = getOptionListDefault();
                var tmpObj2 = {};
                tmpObj2['JOB_PopupModalRows'] = tmpObj['JOB_PopupModalRows'];
                saveOption(tmpObj2, function () {
                    window.scrollTo(0, 0);
                    window.location.reload(true);
                });
            }
        });

        // share
        $('.share-link').on('click', function (e) {
            e.preventDefault();
            var openIn = $(this).attr('data-open-in');
            var href = $(this).attr('href');
            if (openIn == 'popup') {
                var width = $(this).attr('data-width');
                var height = screen.height * 0.6;
                var left = (screen.width - width) / 2;
                var top = screen.height * 0.1;
                window.open(href, '',
                    'menubar=0, toolbar=0, resizable=1, location=0, scrollbars=1, status=1, ' +
                    'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top);
            } else if (openIn == 'newtab') {
                window.open(href, '_blank');
            } else if (openIn == 'copy') {
                $('#clipboard-input').val(getLink('linkShare')).select();
                document.execCommand('Copy');
                alert('Copied to Clipboard~');
            }
        });

        // show more
        $('.hide-long-btn').on('click', function (e) {
            e.preventDefault();
            $(this).prev('.hide-long').removeClass('hide-long');
            $(this).remove();
        });

        // import & export
        var importContainer = $('#opt-import-0-0');
        var importTextarea = importContainer.children('textarea');
        importTextarea.attr('placeholder', importContainer.find('.lang .placeholder').text());
        importContainer.find('a.btn').on('click', function (e) {
            e.preventDefault();
            try {
                importContainer.addClass('wait');
                var value = importTextarea.val();
                if (value.length === 0) {
                    importContainer.removeClass('wait');
                    return;
                }
                if (!value.startsWith('----------- WATERLOOWORKS AZURE OPTIONS BEGIN -----------')
                    || !value.endsWith('----------- WATERLOOWORKS AZURE OPTIONS END -----------')) {
                    throw 'Format error';
                } else {
                    value = value.replace(/-----------.*-----------/g, '').trim();
                    value = JSON.parse(window.atob(value));
                    browser.storage.sync.set(value, function () {
                        alert(importContainer.find('.lang .success').text());
                        window.location.hash = '';
                        window.location.reload();
                    });
                }
            } catch (error) {
                importContainer.removeClass('wait');
                importContainer.find('.import-info-container .import-info')
                    .removeClass('success')
                    .addClass('failed')
                    .text(
                        importContainer.find('.lang .failed').text()
                    );
            }
        });

        var exportContainer = $('#opt-import-1-0');
        var exportTextarea = exportContainer.children('textarea');
        exportTextarea.attr('placeholder', exportContainer.find('.lang .placeholder').text());
        exportContainer.find('a.btn').on('click', function (e) {
            e.preventDefault();
            try {
                exportContainer.addClass('wait');
                browser.storage.sync.get(getOptionListDefault(), function (items) {
                    exportTextarea.val(
                        '----------- WATERLOOWORKS AZURE OPTIONS BEGIN -----------\n' +
                        window.btoa(JSON.stringify(items)) +
                        '\n----------- WATERLOOWORKS AZURE OPTIONS END -----------'
                    );
                    exportContainer.removeClass('wait');
                    exportContainer.find('.import-info-container .import-info')
                        .removeClass('failed')
                        .addClass('success')
                        .text(
                            exportContainer.find('.lang .success').text()
                        );
                    exportTextarea.select();
                    document.execCommand('Copy');
                });
            } catch (error) {
                exportContainer.removeClass('wait');
                exportContainer.find('.import-info-container .import-info')
                    .removeClass('success')
                    .addClass('failed')
                    .text(
                        exportContainer.find('.lang .failed').text()
                    );
            }
        });

        // welcome
        if (params.hasOwnProperty('welcome')) {
            setTimeout(function () {
                var welcome = $('#welcome-content').clone();
                welcome.removeAttr('id').removeClass('hidden');
                var popupCls = initPopup('WaterlooWorks Azure', welcome, '', 1);
                $('.' + popupCls).find('.popup-btn').on('click', function (e) {
                    e.preventDefault();
                    window.location.href = removeSearchParameters('welcome');
                });
            }, 500);
        }

    }

    function sortThemes(a, b) {
        if (a.sort_id < b.sort_id) {
            return -1;
        }
        if (a.sort_id > b.sort_id) {
            return 1;
        }
        return 0;
    }

    function loadThemes() {
        var themes = getThemeConfigs();
        var list = $('#theme-list');
        var newTag = '', subTitle = '';

        var themesArr = [];
        $.each(themes, function () {
            themesArr.push(this);
        });

        themesArr.sort(sortThemes);

        themesArr.forEach(function (val, i) {

            if (val.hasOwnProperty('isNew') && val['isNew']) {
                newTag = "<div class='new-tag' style='float:left;margin:8px 5px 0 0'>NEW</div>";
            } else {
                newTag = '';
            }

            if (val.hasOwnProperty('name2')) {
                subTitle = '<span class="theme-subtitle">' + val['name2'] + '</span>';
            } else {
                subTitle = '';
            }

            if (val['hidden'] == false) {
                var themeItem = $('<div class="width-50 pull-left"><input type="radio" id="opt-global-2-' + i + '" name="GLB_ThemeID" value="' + val['id'] + '" data-option-name="GLB_ThemeID" data-option-type="enum"><label for="opt-global-2-' + i + '" title="' + val['name'] + '\nCreated by ' + val['author'] + '"><p>' + val['name'] + subTitle + newTag + '</p><img src="../theme/theme_' + val['id'] + '/preview.png" alt="' + val['name'] + '" class="theme-sample"></label></div>');
                // if (newTag == '') {
                themeItem.appendTo(list);
                // } else {
                //     themeItem.prependTo(list);
                // }
            }

        });

    }

    $(window).on('load', function (e) {

        $('*[data-href]').each(function (idx, elem) {
            var self = $(elem);
            var link = getLink(self.attr('data-href'));
            if (elem.hasAttribute('data-href-suffix'))
                link += getLink(self.attr('data-href-suffix'));
            self.attr('href', link);
        });

        loadThemes();

        restoreOptions();

        // version #
        $('#azure-version').text(browser.runtime.getManifest().version);

        // feedback
        $('#feedback-link').attr('href', getFeedbackLink());

        // clipboard input
        var clipBoardInput = $('<div class="width-0"><input type="text" id="clipboard-input"></div>');
        $('body').append(clipBoardInput);
    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();
