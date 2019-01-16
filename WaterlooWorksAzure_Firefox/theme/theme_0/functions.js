function startTheme() {
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

}

setTimeout(startTheme, 5);