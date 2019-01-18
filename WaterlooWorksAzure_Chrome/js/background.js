/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        chrome.tabs.create({
            'url': chrome.runtime.getURL('/html/options.html?welcome=show')
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
    chrome.storage.sync.set({
        OPT_Version: newVer
    });

    // scripts
    // ...

    console.log('Option version updated!');
}

function createToolbarContextMenu(id, title, contexts, onClick) {

    chrome.contextMenus.remove(id, function () {
        chrome.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
        if (chrome.runtime.lastError) {
        }
    });

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
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
    chrome.runtime.onInstalled.addListener(installWelcome);
    chrome.runtime.setUninstallURL("https://www.zijianshao.com/wwazure/uninstall/?platform=chrome", function () {
        if (chrome.runtime.lastError) {
        }
    });

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

    });

    /**
     * Chrome API Calls From Content Scripts
     */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

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

            chrome.tabs.executeScript(sender.tab.id, obj);

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // inject css
        else if (request.action == 'insertCSS') {

            var obj = {};

            obj[request.data.type] = request.data.content;
            chrome.tabs.insertCSS(sender.tab.id, obj);

            if (typeof sendResponse === 'function') sendResponse(obj);

        }

        // app.getDetails
        else if (request.action == 'getDetails') {
            var obj = chrome.runtime.getManifest();
            if (typeof sendResponse === 'function') sendResponse(obj);
        }

        // open new tab
        else if (request.action == 'createTab') {
            chrome.tabs.create({
                'url': request.data.url
            });
        }

    });

    /**
     * Add toolbar context menu
     */
    createToolbarContextMenu('azure-website', chrome.i18n.getMessage('officialWebsite'), ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.zijianshao.com/wwazure/'
        });
    });
    createToolbarContextMenu('azure-contribute', chrome.i18n.getMessage('contribute'), ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.paypal.me/zjshao'
        });
    });
    createToolbarContextMenu('azure-github', 'GitHub', ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://github.com/SssWind/Waterlooworks-Azure'
        });
    });
}

initBackground();
