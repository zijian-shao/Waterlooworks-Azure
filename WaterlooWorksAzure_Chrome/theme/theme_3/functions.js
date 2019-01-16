function startTheme() {

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
    setTimeout(function () {
        orbisApp.tabLogic = function () {
        };
        orbisApp.startTabLogic = function () {
        };
    }, 1000);

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        var headerText = $('.orbisModuleHeader').text();
        if (!$('.messageView').length && !headerText.match(/Send A Message/)
            && !headerText.match(/Submit A Form/) && !headerText.match(/Form Details/)) {
            // not msg view / submit form
            $('#mainContentDiv .orbis-posting-actions:first').addClass('violet-dashboard-btn-float');
        }
        if (headerText.match(/Form Details/)) {
            $('.orbisModuleHeader h4').attr('style', '');
        }
    }

}

setTimeout(startTheme, 5);