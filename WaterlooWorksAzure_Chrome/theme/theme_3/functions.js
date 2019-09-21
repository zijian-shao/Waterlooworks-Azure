function startTheme() {

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

    // move nav list
    var navList = $('#closeNav').children('.sidebar-nav').find('.sidebar-nav').first();
    $('.bs--hide__column').remove();
    $('#brandingNav').append(navList);

    // change brand
    var brandImg = $('<img/>', {
        'src': baseURL + 'theme/theme_3/brand.png',
        'alt': 'WaterlooWorks'
    });
    $('#brandingNav .navbar-inner .brand').html(brandImg);

    // prepend banner
    var banner = $('<div/>', {
        'class': 'violet-banner'
    });
    var bannerLine = $('<div/>', {
        'class': 'violet-banner-line'
    });
    banner.append(bannerLine).append(bannerLine.clone());
    $('#mainContentDiv').prepend(banner);

    // remove defaul orbisApp tab logic function
    injectJS('setTimeout(function () {' +
        'orbisApp.tabLogic = function () {};' +
        'orbisApp.startTabLogic = function () {};' +
        '}, 1000);', 'body', 'text');

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        var headerText = $('.orbisModuleHeader').text();
        if (headerText.match(/Form Details/)) {
            $('.orbisModuleHeader h4').attr('style', '');
        }
    }

    // child theme
    if (typeof startChildTheme === 'function') {
        setTimeout(startChildTheme, 1);
    }

}

setTimeout(startTheme, 5);