var baseURL, currURL, options, configs, themeConfig;

function injectScript(url, tag, type, callback) {

    var script = document.createElement('script');
    script.type = 'text/javascript';

    if (type == 'text') {
        script.textContent = url;
    } else {
        script.src = url;
    }

    var tags = document.getElementsByTagName(tag);

    if (tags.length > 0) {
        tags[0].appendChild(script);
    } else {
        document.documentElement.appendChild(script);
    }

    if (typeof callback === 'function')
        callback();

}

function addCover(color) {

    var cover = document.createElement("div");
    cover.id = 'azure-load-cover';
    cover.style = 'position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999; background: ' + color + ';';
    document.documentElement.appendChild(cover);

}

function testRedirect() {
    if (options.GLB_AutoRedirectToLogin) {

        if (currURL.match(/\/notLoggedIn\.htm/i)
            || currURL.match(/\/logout\.htm/i)) {
            location.href = location.protocol + "//" + location.host + "/home.htm";
            return true;
        }
    }
    return false;
}

function initAzure() {

    function init() {

        if (!options.GLB_Enabled)
            return;

        themeConfig = getThemeConfigs(options.GLB_ThemeID);

        // add cover
        addCover(themeConfig.overlayColor);

        // if not logged in
        testRedirect();
    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();
    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });

    browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    });
}

initAzure();
