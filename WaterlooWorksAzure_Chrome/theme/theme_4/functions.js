function startTheme() {

    // prepend banner
    $('<div class="blue-banner"><div class="pattern"></div></div>').appendTo($('#mainContentDiv'));

    // nav button float right
    var navHelp, navLogout;
    $('#closeNav ul.nav-list li').each(function (i, e) {
        var navText = $(e).text();
        if (navText.match(/Help/)) {
            navHelp = $(e);
            $(e).addClass('azure-nav-right');
        } else if (navText.match(/Logout/)) {
            navLogout = $(e);
            $(e).addClass('azure-nav-right');
        } else if (navText.match(/Appointments/) && navText.match(/Further/)) {
            $(e).html($(e).html().replace(/ - Further Education/, '<small>( Further Education )</small>'));
        }
    });
    navLogout.insertBefore(navHelp);

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        var headerText = $('.orbisModuleHeader').text();
        if ($('.messageView').length) {

        } else if (headerText.match(/Send A Message/)
            || headerText.match(/Submit A Form/)
            || headerText.match(/Form Details/)) {
            $('#mainContentDiv .orbisModuleHeader h1').css('margin-bottom', '20px');
        } else {
            // not msg view / submit form
            $('#mainContentDiv .orbis-posting-actions:first').addClass('blue-dashboard-btn-float');
        }
        if (headerText.match(/Form Details/)) {
            $('.orbisModuleHeader h4').attr('style', '');
        }
    }

    // remove defaul orbisApp tab logic function
    injectJS('setTimeout(function () {' +
        'orbisApp.tabLogic = function () {};' +
        'orbisApp.startTabLogic = function () {};' +
        '}, 1000);', 'body', 'text');

    // detail page h1
    if ($('#postingDiv').length) {
        $('#mainContentDiv .orbisModuleHeader h1').css('margin-bottom', '10px');
    }

}

setTimeout(startTheme, 5);