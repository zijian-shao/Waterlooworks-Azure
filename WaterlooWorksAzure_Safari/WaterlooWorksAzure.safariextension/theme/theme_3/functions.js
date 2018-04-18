(function startTheme() {

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
    orbisApp.tabLogic = function () {
    };
    orbisApp.startTabLogic = function () {
    };

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        if (!$('.messageView').length)
            $('#mainContentDiv .orbis-posting-actions:first').addClass('violet-dashboard-btn-float');
    }

})();