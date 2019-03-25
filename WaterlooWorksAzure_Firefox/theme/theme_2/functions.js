function startTheme() {

    // change brand
    var brandImg = $('<img/>', {
        'src': baseURL + 'theme/theme_2/brand.png',
        'alt': 'WaterlooWorks'
    });
    $('#brandingNav .navbar-inner .brand').html(brandImg);

    // prepend banner
    var banner = $('<div/>', {
        'class': 'citrus-banner'
    });
    var bannerLine = $('<div/>', {
        'class': 'citrus-banner-line'
    });
    banner.append(bannerLine).append(bannerLine.clone());
    $('#mainContentDiv').prepend(banner);

    // remove defaul orbisApp tab logic function
    injectJS('setTimeout(function () {' +
        'orbisApp.tabLogic = function () {};' +
        'orbisApp.startTabLogic = function () {};' +
        '}, 1000);', 'body', 'text');

    // nav icons
    $('#closeNav ul.nav-list li a').each(function (i, e) {
        var navText = $(e).text();
        if (navText.match(/Dashboard/)) {
            $(e).prepend($('<i class="icon-dashboard"></i>'));
        } else if (navText.match(/Hire Waterloo Co-op/)) {
            $(e).prepend($('<i class="icon-book"></i>'));
        } else if (navText.match(/Hire Waterloo/) && !navText.match(/Hire Waterloo Co-op/)) {
            $(e).prepend($('<i class="icon-briefcase"></i>'));
        } else if (navText.match(/Appointments/) && !navText.match(/Further/)) {
            $(e).prepend($('<i class="icon-comment"></i>'));
        } else if (navText.match(/Appointments/) && navText.match(/Further/)) {
            $(e).prepend($('<i class="icon-comments"></i>'));
            $(e).html($(e).html().replace(/ - Further Education/, '<small>Further Education</small>'));
        } else if (navText.match(/Help/)) {
            $(e).prepend($('<i class="icon-info-sign"></i>'));
        } else if (navText.match(/Logout/)) {
            $(e).prepend($('<i class="icon-signout"></i>'));
        }
    });

    // hide side bar
    if (currURL.match(/\/coop-postings\.htm/) || currURL.match(/\/jobs-postings\.htm/)) {
        if ($('#postingsTablePlaceholder').length) {

            var hideBtn;
            if (getCookie('azure-sidebar-visibility') == '0') {
                $('body').addClass('azure-full-width');
                hideBtn = $('<div class="azure-hide-sidebar" id="azure-hide-sidebar"><i class="icon-angle-right"></i></div>');
            } else {
                hideBtn = $('<div class="azure-hide-sidebar" id="azure-hide-sidebar"><i class="icon-angle-left"></i></div>');
            }

            hideBtn.on('click', function (e) {
                e.preventDefault();
                var body = $('body');
                var icon = $(this).children('i');
                $('.bs--hide__column').removeAttr('style');
                if (body.hasClass('azure-full-width')) {
                    icon.addClass('icon-angle-left').removeClass('icon-angle-right');
                    setCookie('azure-sidebar-visibility', '1');
                } else {
                    icon.removeClass('icon-angle-left').addClass('icon-angle-right');
                    setCookie('azure-sidebar-visibility', '0');
                }
                body.toggleClass('azure-full-width');
                fixTableHeader($('#postingsTable'));
            });
            $('.bs--hide__column').before(hideBtn);
            // fixTableHeader($('#postingsTable'));
        }
    }

}

setTimeout(startTheme, 5);