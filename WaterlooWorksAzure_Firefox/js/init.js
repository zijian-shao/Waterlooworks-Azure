var baseURL, currURL, options, configs, themeConfigs;

/**
 * Inject css
 * @param url Css text if type = 'text'; otherwise href url
 * @param tag Inject to target tag
 * @param type 'text' or others, optional
 */
function injectCSS(url, tag, type) {

    var style;

    if (type === 'text') {

        style = $('<style/>');

        style.text(url);

    } else {

        style = $('<link/>', {
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': url
        });

    }

    $(tag).append(style);

}

/**
 * Inject css
 * @param url JS text if type = 'text'; otherwise src url
 * @param tag Inject to target tag
 * @param type 'text' or others, optional
 * @param callback
 */
function injectJS(url, tag, type, callback) {

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

function initAzure() {

    function init() {

        if (!options.GLB_Enabled)
            return;

        // redirect to home
        if (options.GLB_AutoRedirectToLogin
            && (currURL.match(/\/notLoggedIn\.htm/i) || currURL.match(/\/logout\.htm/i))) {
            location.href = location.protocol + "//" + location.host + "/home.htm";
            return;
        }

        // overlay
        themeConfigs = getThemeConfigs(options.GLB_ThemeID);
        addCover(themeConfigs.overlayColor);

    }

    baseURL = browser.runtime.getURL('');
    currURL = window.location.href;
    configs = getOptionListDefault();
    browser.storage.sync.get(configs, function (e) {
        options = e;
        init();
    });
}

initAzure();
