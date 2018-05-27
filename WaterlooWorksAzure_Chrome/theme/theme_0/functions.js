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
        }
    });
    navLogout.insertBefore(navHelp);
}

setTimeout(startTheme, 5);