function initAzureIdle() {

    function extensionUpdate() {

        var oldVer = options.EXT_Version, newVer;

        console.log('WaterlooWorks Azure (V' + oldVer + ')');

        chrome.runtime.sendMessage({action: 'getDetails'}, function (response) {

            newVer = response.version;

            // update storage
            chrome.storage.sync.set({
                'EXT_Version': newVer
            });

            // return on install
            // if (oldVer == '0.0.0')
            //     return;

            if (versionCompare(oldVer, newVer) >= 0)
                return;

            console.log('New version updated (V' + newVer + ')');

            if (!oldVer.match(/2\.9\./) && newVer.match(/1\.9\./)) {
                chrome.runtime.sendMessage({
                    action: 'createTab',
                    data: {url: 'https://www.zijianshao.com/wwazure/whatsnew/?version=1.9.0&platform=chrome'}
                });
            }else if (!oldVer.match(/1\.9\./) && newVer.match(/1\.9\./)) {
                chrome.runtime.sendMessage({
                    action: 'createTab',
                    data: {url: 'https://www.zijianshao.com/wwazure/whatsnew/?version=1.9.0&platform=chrome'}
                });
            } else if (newVer == '1.0.0') {

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

    if (!options.GLB_Enabled)
        return;

    var jsText = '';

    // global var
    jsText += 'var baseURL = "' + baseURL + '";';
    jsText += 'var options = ' + JSON.stringify(options) + ';';
    jsText += 'var themeConfig = ' + JSON.stringify(themeConfigs) + ';';
    jsText += 'var currURL = "' + currURL + '";';
    injectScript(jsText, 'head', 'text');

    // func
    injectScript(baseURL + 'js/functions.js', 'head');

    // theme func
    if (currURL.match(/\/myAccount\//))
        injectScript(baseURL + 'theme/theme_' + options.GLB_ThemeID + '/functions.js', 'head');

    extensionUpdate();
}

initAzureIdle();