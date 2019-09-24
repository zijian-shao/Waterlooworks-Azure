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
    $('#closeNav .sidebar-nav > ul.nav-list > li > a').each(function (i, e) {
        var self = $(this);
        var navText = self.text();
        if (navText.match(/Dashboard/)) {
            self.prepend($('<i class="icon-dashboard"></i>'));
        } else if (navText.match(/Hire Waterloo Co-op/)) {
            self.prepend($('<i class="icon-book"></i>'));
        } else if (navText.match(/Hire Waterloo(?! Co-op)/)) {
            self.prepend($('<i class="icon-briefcase"></i>'));
        } else if (navText.match(/Career Centre Events/)) {
            self.prepend($('<i class="icon-bell-alt"></i>'));
        } else if (navText.match(/Appointments/)) {
            self.prepend($('<i class="icon-comment"></i>'));
            self.closest('li').find('ul.nav-list.childMenu1 > li > a').each(function (i, e) {
                var self = $(this);
                self.text(self.text().replace(/Appointments - /g, ''));
                self.text(self.text().replace(/ Students/g, ''));
                self.text(self.text().replace(/ Education/g, ' Edu'));
            });
        } else if (navText.match(/Help/)) {
            self.prepend($('<i class="icon-info-sign"></i>'));
        } else if (navText.match(/Logout/)) {
            self.prepend($('<i class="icon-signout"></i>'));
        } else {
            self.prepend($('<i class="icon-plus"></i>'));
        }
    });

    // hide side bar
    if (currURL.match(/\/coop-postings\.htm/) || currURL.match(/\/jobs-postings\.htm/)) {
        if ($('#postingsTablePlaceholder').length) {

            var hideBtn;
            // if (getCookie('azure-sidebar-visibility') == '0') {
            if (window.localStorage.getItem('azure-sidebar-visibility') == '0') {
                $('body').addClass('azure-full-width');
                hideBtn = $('<div class="azure-hide-sidebar" id="azure-hide-sidebar"><i class="icon-angle-right"></i></div>');
                setTimeout(function () {
                    fixTableHeader($('#postingsTable'));
                }, 1500);
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
                    // setCookie('azure-sidebar-visibility', '1');
                    window.localStorage.setItem('azure-sidebar-visibility', '1');
                } else {
                    icon.removeClass('icon-angle-left').addClass('icon-angle-right');
                    // setCookie('azure-sidebar-visibility', '0');
                    window.localStorage.setItem('azure-sidebar-visibility', '0');
                }
                body.toggleClass('azure-full-width');
                fixTableHeader($('#postingsTable'));
            });
            $('.bs--hide__column').before(hideBtn);
            // fixTableHeader($('#postingsTable'));
        }
    }

    // child theme
    if (typeof startChildTheme === 'function') {
        setTimeout(startChildTheme, 1);
    }

}

setTimeout(startTheme, 5);