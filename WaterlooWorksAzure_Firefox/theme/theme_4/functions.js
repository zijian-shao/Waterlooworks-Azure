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
        }
    });
    navLogout.insertBefore(navHelp);

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        if ($('.messageView').length) {

        } else if ($('.orbisModuleHeader').text().match(/Send A Message/)) {
            $('#mainContentDiv .orbisModuleHeader h1').css('margin-bottom', '20px');
        } else {
            // not msg view
            $('#mainContentDiv .orbis-posting-actions:first').addClass('blue-dashboard-btn-float');
        }
    }

    // remove defaul orbisApp tab logic function
    setTimeout(function () {
        orbisApp.tabLogic = function () {
        };
        orbisApp.startTabLogic = function () {
        };
    }, 1000);

    // detail page h1
    if ($('#postingDiv').length) {
        $('#mainContentDiv .orbisModuleHeader h1').css('margin-bottom', '10px');
    }

}

setTimeout(startTheme, 5);