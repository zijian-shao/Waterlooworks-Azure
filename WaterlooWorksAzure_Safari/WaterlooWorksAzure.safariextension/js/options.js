function initOptions() {

    function restoreOptions() {

        safari.self.addEventListener('message', function (event) {
            if (event.name == 'options') {
                var items = event.message;

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

                        default:
                            optionElem.prop('checked', items[key]);
                    }

                }

                if (items.JOB_ColumnDisplayType == 1)
                    $('#columnsList').show();
                else
                    $('#columnsList').hide();


                // theme preview color
                var themeConfigs = getThemeConfigs();
                $('input[name="GLB_ThemeID"]').each(function (i, e) {
                    $(e).parent('p').before($('<div class="color-scheme"><span style="background:' + themeConfigs['theme_' + $(e).attr('value')].previewColor + '"></span></div>'));
                });

                bindEvents();

            }
        },false);

        safari.self.tab.dispatchMessage('getOptions');
    }

    function saveOption(obj, callback) {

        $('#azure-toast').removeClass('azure-toast-hidden');

        window.clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(function () {
            $('#azure-toast').addClass('azure-toast-hidden');
        }, 1000);

        safari.self.tab.dispatchMessage('saveOptions', obj);

        if ($.type(callback) === 'function') {
            callback();
        }
    }


    function onOptionChange(elem) {
        var inputType = elem.attr('type');
        var optType = elem.attr('data-option-type');
        var optName = elem.attr('data-option-name');
        var optVal = elem.attr('data-option-value');

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
        }

        else if (inputType == 'radio') {

            switch (optType) {
                // save "value" attr of the radio
                case 'enum':

                    var obj = {};
                    obj[optName] = elem.attr('value');
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
        // event
        $('input').on('change', function () {
            onOptionChange($(this));
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
                saveOption(defaultPopupModalRows, function () {
                    window.scrollTo(0, 0);
                    window.location.reload(true);
                });
            }
        });
    }

    $(window).load(function () {
        restoreOptions();
        $('#azure-version').text(safari.extension.displayVersion);
    });

    window.addEventListener("hashchange", onHashChange, false);

    var timeoutHandle = setTimeout(function () {

    }, 0);

}

initOptions();

const defaultPopupModalRows = {
    'JOB_PopupModalRows': {
        'row_0': {
            'name': 'Job Title',
            'display': true
        },
        'row_1': {
            'name': 'Organization',
            'display': true
        },
        'row_2': {
            'name': 'Region',
            'display': true
        },
        'row_3': {
            'name': 'Application Documents Required',
            'display': true
        },
        'row_4': {
            'name': 'Application Information',
            'display': true
        },
        'row_5': {
            'name': 'Application Method',
            'display': true
        },
        'row_6': {
            'name': 'Required Skills',
            'display': true
        },
        'row_7': {
            'name': 'Job Summary',
            'display': true
        },
        'row_8': {
            'name': 'Job Responsibilities',
            'display': true
        },
        'row_9': {
            'name': 'Compensation And Benefits',
            'display': true
        },
        'row_10': {
            'name': 'Position Type',
            'display': false
        },
        'row_11': {
            'name': 'Level',
            'display': false
        },
        'row_12': {
            'name': 'Job Openings',
            'display': false
        },
        'row_13': {
            'name': 'Job Category',
            'display': false
        },
        'row_14': {
            'name': 'Term Posted',
            'display': false
        },
        'row_15': {
            'name': 'Start Date',
            'display': false
        },
        'row_16': {
            'name': 'End Date',
            'display': false
        },
        'row_17': {
            'name': 'Career Development And Training',
            'display': false
        },
        'row_18': {
            'name': 'Targeted Degrees And Disciplines',
            'display': false
        },
        'row_19': {
            'name': 'Application Deadline',
            'display': false
        },
        'row_20': {
            'name': 'Application Delivery',
            'display': false
        },
        'row_21': {
            'name': 'Division',
            'display': false
        }
    }
};