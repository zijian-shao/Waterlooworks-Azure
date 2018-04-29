/**
 * Welcome on install
 * @param details
 */
function installWelcome(details) {
    if (details.reason === 'install') {
        chrome.runtime.openOptionsPage();
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

function createContextMenu(id, title, contexts, onClick) {

    chrome.contextMenus.remove(id, function () {
        chrome.contextMenus.create({
            id: id,
            title: title,
            contexts: contexts
        });
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

        // app.getDetails
        else if (request.action == 'getDetails') {
            obj = chrome.runtime.getManifest();
        }

        // open new tab
        else if (request.action == 'createTab') {
            chrome.tabs.create({
                'url': request.data.url
            });
        }

        if (typeof sendResponse === 'function') {
            // var response = {'status': 1};
            sendResponse(obj);
        }

    });

    /**
     * Add toolbar context menu
     */
    createContextMenu('azure-website', chrome.i18n.getMessage('officialWebsite'), ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.zijianshao.com/wwazure/'
        });
    });
    createContextMenu('azure-contribute', chrome.i18n.getMessage('contribute'), ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://www.paypal.me/zjshao'
        });
    });
    createContextMenu('azure-github', 'GitHub', ['browser_action'], function () {
        chrome.tabs.create({
            'url': 'https://github.com/SssWind/Waterlooworks-Azure'
        });
    });
}

initBackground();
