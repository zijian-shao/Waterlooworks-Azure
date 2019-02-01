function extensionUpdate() {

    var oldVer = options.EXT_Version, newVer;

    console.log('WaterlooWorks Azure (V' + oldVer + ')');

    browser.runtime.sendMessage({action: 'getDetails'}, function (response) {

        newVer = response.version;

        // update storage
        browser.storage.sync.set({
            'EXT_Version': newVer
        });

        // return on install
        if (oldVer == '0.0.0')
            return;

        if (versionCompare(oldVer, newVer) >= 0)
            return;

        console.log('New version updated (V' + newVer + ')');

        if (!oldVer.match(/2\.0\./) && newVer.match(/2\.0\./)) {
            // browser.runtime.sendMessage({
            //     action: 'createTab',
            //     data: {url: 'https://www.zijianshao.com/wwazure/whatsnew/?version=2.0.0&platform=chrome'}
            // });
        }

        console.log('Extension update script executed!');
    });
}

/**
 * Compare Versions
 * @param v1
 * @param v2
 * @param options
 * @returns {*}
 *  0 if the versions are equal
 *  a negative integer iff v1 < v2
 *  a positive integer iff v1 > v2
 * NaN if either version string is in the wrong format
 */
function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}

function initAzureIdle() {

    if (!options.GLB_Enabled)
        return;

    var jsText = '';

    // css
    customFont();
    injectCSS(baseURL + 'css/common.css', 'head');

    if (currURL.match(/\/myAccount\//i)) {
        // student
        injectCSS(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/common.css', 'head');
    } else if (currURL.match(/\/home\.htm/)) {
        // homepage page
        if (options.GLB_ReplaceLoginPage) {
            injectCSS(baseURL + 'css/homepage.css', 'head');
            replaceHomepage();
        }
    } else if (currURL.match(/\/employer\//)) {
        // employer page
        injectCSS(baseURL + 'theme/theme_0/common.css', 'head');
        injectCSS(baseURL + 'css/employer.css', 'head');
    }

    // global var
    jsText += 'var baseURL = "' + baseURL + '";';
    jsText += 'var options = ' + JSON.stringify(options) + ';';
    jsText += 'var themeConfigs = ' + JSON.stringify(themeConfigs) + ';';
    jsText += 'var currURL = "' + currURL + '";';
    injectJS(jsText, 'head', 'text');

    // extra functions
    injectJS(baseURL + 'js/functions_inject.js', 'head', 'url', function () {
        if (!needBuildForm()) {
            setTimeout(function () {
                if (currURL.match(/\/myAccount\/dashboard\.htm/i))
                    injectJS(baseURL + 'js/messages.js', 'head');
                if (currURL.match(/\/jobs-postings\.htm/) || currURL.match(/\/coop-postings\.htm/)) {
                    injectJS(baseURL + 'js/postings.js', 'head');
                    if (options.JOB_ShortlistExport)
                        injectJS(baseURL + 'js/libs/shortlist-export.js', 'head');
                }
            }, 50);
        }
    });

    // theme func
    if (currURL.match(/\/myAccount\//)) {
        browser.runtime.sendMessage({
            action: 'executeScript',
            data: {
                type: 'file',
                content: 'theme/theme_' + options.GLB_ThemeID + '/functions.js'
            }
        });
    }

    extensionUpdate();

    startAzure();
}

initAzureIdle();