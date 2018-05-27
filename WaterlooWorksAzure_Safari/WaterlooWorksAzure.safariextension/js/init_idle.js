function initAzureIdle() {

    if (window.self !== window.top)
        return;

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

}

initAzureIdle();