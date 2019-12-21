function startTheme() {
    var navHelp, navLogout;
    $('#closeNav .sidebar-nav > ul.nav-list > li > a').each(function (i, e) {
        var self = $(this);
        var navText = self.text();
        if (navText.match(/Help/)) {
            navHelp = self.closest('li');
            navHelp.addClass('azure-nav-right');
        } else if (navText.match(/Logout/)) {
            navLogout = self.closest('li');
            navLogout.addClass('azure-nav-right');
        } else if (navText.match(/Appointments/)) {
            self.closest('li').find('ul.nav-list.childMenu1 > li > a').each(function (i, e) {
                var self = $(this);
                self.text(self.text().replace(/Appointments - /g, ''));
                self.text(self.text().replace(/ Students/g, ''));
                self.text(self.text().replace(/ Education/g, ' Edu'));
            });
        } else if (navText.match(/Employer Information Sessions/)) {
            self.text('Info Sessions');
        } else if (navText.match(/Career Centre Events/)) {
            self.text('Events');
        }
    });
    if (typeof navHelp !== typeof undefined && typeof navLogout !== typeof undefined)
        navLogout.insertBefore(navHelp);

}

setTimeout(startTheme, 5);