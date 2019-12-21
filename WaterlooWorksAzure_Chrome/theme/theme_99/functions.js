function startTheme() {
    // hide side bar
    if (currURL.match(/\/coop-postings\.htm/) || currURL.match(/\/jobs-postings\.htm/)) {
        if ($('#postingsTablePlaceholder').length) {

            var hideBtn;
            // if (getCookie('azure-sidebar-visibility') == '0') {
            if (window.localStorage.getItem('azure-sidebar-visibility') == '0') {
                $('body').addClass('azure-full-width');
                hideBtn = $('<div class="azure-hide-sidebar" id="azure-hide-sidebar"><i class="icon-angle-right"></i></div>');
                setTimeout(function () {
                    fixTableHeader($('#postingsTable'));
                }, 1500);
            } else {
                hideBtn = $('<div class="azure-hide-sidebar" id="azure-hide-sidebar"><i class="icon-angle-left"></i></div>');
            }

            hideBtn.on('click', function (e) {
                e.preventDefault();
                var body = $('body');
                var icon = $(this).children('i');
                $('.bs--hide__column').removeAttr('style');
                if (body.hasClass('azure-full-width')) {
                    icon.addClass('icon-angle-left').removeClass('icon-angle-right');
                    // setCookie('azure-sidebar-visibility', '1');
                    window.localStorage.setItem('azure-sidebar-visibility', '1');
                } else {
                    icon.removeClass('icon-angle-left').addClass('icon-angle-right');
                    // setCookie('azure-sidebar-visibility', '0');
                    window.localStorage.setItem('azure-sidebar-visibility', '0');
                }
                body.toggleClass('azure-full-width');
                fixTableHeader($('#postingsTable'));
            });
            $('.bs--hide__column').before(hideBtn);
            // fixTableHeader($('#postingsTable'));
        }
    }

    // nav icons
    $('#closeNav .sidebar-nav > ul.nav-list > li > a').each(function (i, e) {
        var self = $(this);
        var navText = self.text();
        if (navText.match(/Appointments/)) {
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

    // child theme
    if (typeof startChildTheme === 'function') {
        setTimeout(startChildTheme, 1);
    }

}

setTimeout(startTheme, 5);