/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        // chrome.tabs.create({
        //     'url': chrome.extension.getURL('/html/welcome.html')
        // });
        chrome.runtime.openOptionsPage();
    }
}

/**
 * Update option
 */
function updateOptions(oldVer, newVer) {

    // update storage
    chrome.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

/**
 * Execute script according to extension version
 * @param oldVer
 * @param newVer
 */
function extensionUpdated(oldVer, newVer) {

    // return on install
    if (oldVer == '0.0.0')
        return;

    // update storage
    chrome.storage.sync.set({
        'EXT_Version': newVer
    });

    if (newVer == '1.9.0') {
        // what's new
        chrome.tabs.create({
            'url': 'https://www.zijianshao.com/wwazure/whatsnew/?version=1.9.0&platform=chrome'
        });
    } else if (newVer == '1.0.0') {
        // scripts
        // ...
    }

    console.log('Extension update script executed!');
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

/**
 * Background Started
 */
console.log('Welcome to WaterlooWorks Azure!');
chrome.runtime.onInstalled.addListener(installWelcome);

var version = getOptionVersion();
var configs = getOptionListDefault();
var options;

/**
 * Check data updates
 */
chrome.storage.sync.get(configs, function (items) {
    options = items;

    // option version
    if (options.OPT_Version < version)
        updateOptions(options.OPT_Version, version);

    // extension version
    if (versionCompare(options.EXT_Version, chrome.app.getDetails().version) < 0)
        extensionUpdated(options.EXT_Version, chrome.app.getDetails().version);

});

/**
 * Chrome API Calls From Content Scripts
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // request = {action: '', data: {type:'', content:''}}
    var obj = {};

    // execute script
    if (request.action == 'executeScript') {

        if (Array.isArray(request.data)) {
            for (var i = 0; i < request.data.length; i++) {
                obj[request.data[i].type] = request.data[i].content;
            }
        } else {
            obj[request.data.type] = request.data.content;
        }

        chrome.tabs.executeScript(sender.tab.id, obj);

    }

    // inject css
    else if (request.action == 'insertCSS') {

        obj[request.data.type] = request.data.content;
        chrome.tabs.insertCSS(sender.tab.id, obj);

    }

    if (typeof sendResponse === 'function') {
        var response = {'status': 1};
        sendResponse(response);
    }

});