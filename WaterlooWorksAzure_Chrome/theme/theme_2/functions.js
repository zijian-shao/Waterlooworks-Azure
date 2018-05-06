(function startTheme() {

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
    setTimeout(function () {
        orbisApp.tabLogic = function () {
        };
        orbisApp.startTabLogic = function () {
        };
    }, 1000);

    // nav icons
    $('#closeNav ul.nav-list li a').each(function (i, e) {
        var navText = $(e).text();
        if (navText.match(/Dashboard/)) {
            $(e).prepend($('<i class="icon-dashboard"></i>'));
        } else if (navText.match(/Hire Waterloo Co-op/)) {
            $(e).prepend($('<i class="icon-book"></i>'));
        } else if (navText.match(/Hire Waterloo/) && !navText.match(/Hire Waterloo Co-op/)) {
            $(e).prepend($('<i class="icon-briefcase"></i>'));
        } else if (navText.match(/Help/)) {
            $(e).prepend($('<i class="icon-info-sign"></i>'));
        } else if (navText.match(/Logout/)) {
            $(e).prepend($('<i class="icon-signout"></i>'));
        }
    });

})();