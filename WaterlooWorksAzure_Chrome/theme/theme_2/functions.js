(function startTheme() {
    // $('.navbar-inverse .brand').text('W');

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
    orbisApp.tabLogic = function () {
    };
    orbisApp.startTabLogic = function () {
    };

})();