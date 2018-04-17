// install welcome
function installWelcome(details) {
    if (details.reason === 'install') {
        browser.tabs.create({
            url: browser.runtime.getURL('')+'html/options.html'
        });
        // browser.runtime.openOptionsPage();
    }
}

function updateOptions() {

}

console.log('Welcome to WaterlooWorks Azure!');
browser.runtime.onInstalled.addListener(installWelcome);

var version = getOptionVersion();
var configs = getOptionListDefault();
var options;

browser.storage.sync.get(configs, function (items) {
    options = items;
    if (options.OPT_Version == 0) {
        browser.storage.sync.clear();
        console.log('Old options cleared!');
    }
    if (options.OPT_Version < version) {
        updateOptions();

        console.log('Option version updated!');
        browser.storage.sync.set({
            OPT_Version: version
        });
    } else {
        console.log('Option version is up to date!');
    }
});

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

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

        browser.tabs.executeScript(sender.tab.id, obj);


    }

    // inject css
    else if (request.action == 'insertCSS') {

        obj[request.data.type] = request.data.content;
        browser.tabs.insertCSS(sender.tab.id, obj);

    }

    if (typeof sendResponse === 'function') {
        var response = {'status': 1};
        sendResponse(response);
    }

});