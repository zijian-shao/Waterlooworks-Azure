function startTheme() {

    // prepend banner
    $('<div class="blue-banner"><div class="pattern"></div></div>').appendTo($('#mainContentDiv'));

    // nav button float right
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
        }
    });
    if (typeof navHelp !== typeof undefined && typeof navLogout !== typeof undefined)
        navLogout.insertBefore(navHelp);

    // dashboard
    if (location.href.match(/\/myAccount\/dashboard\.htm/gi)) {
        // float dashboard buttons
        var headerText = $('.orbisModuleHeader').text();

        if (headerText.match(/Form Details/)) {
            $('.orbisModuleHeader h4').attr('style', '');
        }
    }

    // remove defaul orbisApp tab logic function
    injectJS('setTimeout(function () {' +
        'orbisApp.tabLogic = function () {};' +
        'orbisApp.startTabLogic = function () {};' +
        '}, 1000);', 'body', 'text');

    // detail page h1
    if ($('#postingDiv').length) {
        $('#mainContentDiv .orbisModuleHeader h1').css('margin-bottom', '10px');
    }

}

setTimeout(startTheme, 5);