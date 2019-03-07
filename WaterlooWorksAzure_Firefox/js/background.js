/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        browser.tabs.create({
            'url': browser.runtime.getURL('/html/options.html?welcome=show')
        });
    }
}

/**
 * Update option
 * @param oldVer
 * @param newVer
 */
function updateOptions(oldVer, newVer) {

    // update storage
    browser.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

function getUninstallLink() {
    function _getOS() {
        var OSName = "Unknown";
        if (window.navigator.userAgent.indexOf("Windows NT 10.0") != -1) OSName = "Windows 10";
        if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName = "Windows 8";
        if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName = "Windows 7";
        if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName = "Windows Vista";
        if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName = "Windows XP";
        if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName = "Windows 2000";
        if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "Mac/iOS";
        if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
        if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
        return OSName;
    }

    function _getBrowser() {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name: 'IE ', version: (tem[1] || '')};
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem != null) return {name: 'Opera', version: tem[1]};
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return {name: M[0], version: M[1]};
    }

    var urlTpl = getLink('uninstall');
    urlTpl = urlTpl.replace('@@platform@@', encodeURI(_getBrowser().name.toLowerCase()));
    urlTpl = urlTpl.replace('@@extVersion@@', encodeURI(browser.runtime.getManifest().version));
    urlTpl = urlTpl.replace('@@browser@@', encodeURI(_getBrowser().name + ' ' + _getBrowser().version));
    urlTpl = urlTpl.replace('@@os@@', encodeURI(_getOS()));

    return urlTpl;
}

function createToolbarContextMenu(id, title, contexts, onClick) {

    browser.contextMenus.remove(id, function () {
        browser.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
        if (browser.runtime.lastError) {
        }
    });

    browser.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId == id) {
            if (typeof onClick === 'function')
                onClick();
        }
    });
}

function initBackground() {
    /**
     * Background Started
     */
    console.log('Welcome to WaterlooWorks Azure!');
    browser.runtime.onInstalled.addListener(installWelcome);
    browser.runtime.setUninstallURL(getUninstallLink(), function () {
        if (browser.runtime.lastError) {
        }
    });

    var version = getOptionVersion();
    var configs = getOptionListDefault();
    var options;

    /**
     * Check data updates
     */
    browser.storage.sync.get(configs, function (items) {
        options = items;

        // option version
        if (options.OPT_Version < version)
            updateOptions(options.OPT_Version, version);

    });

    /**
     * Firefox API Calls From Content Scripts
     */
    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        // request = {action: '', data: {type:'', content:''}}

        // execute script
        if (request.action == 'executeScript') {

            var obj = {};

            if (Array.isArray(request.data)) {
                for (var i = 0; i < request.data.length; i++) {
                    obj[request.data[i].type] = request.data[i].content;
                }
            } else {
                obj[request.data.type] = request.data.content;
            }

            browser.tabs.executeScript(sender.tab.id, obj);

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // inject css
        else if (request.action == 'insertCSS') {

            var obj = {};

            obj[request.data.type] = request.data.content;
            browser.tabs.insertCSS(sender.tab.id, obj);

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // app.getDetails
        else if (request.action == 'getDetails') {
            var obj = browser.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);
        }

        // open new tab
        else if (request.action == 'createTab') {
            browser.tabs.create({
                'url': request.data.url
            });
        }

    });

    /**
     * Add toolbar context menu
     */
    createToolbarContextMenu('azure-website', browser.i18n.getMessage('officialWebsite'), ['browser_action'], function () {
        browser.tabs.create({
            'url': getLink('officialWebsite')
        });
    });
    createToolbarContextMenu('azure-contribute', browser.i18n.getMessage('contribute'), ['browser_action'], function () {
        browser.tabs.create({
            'url': getLink('donate')
        });
    });
    createToolbarContextMenu('azure-github', 'GitHub', ['browser_action'], function () {
        browser.tabs.create({
            'url': getLink('github')
        });
    });
}

initBackground();
