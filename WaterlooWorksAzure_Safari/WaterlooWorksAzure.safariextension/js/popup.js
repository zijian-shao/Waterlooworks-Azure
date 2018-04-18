function initPopup() {

    var baseURL = safari.extension.baseURI;

    // $('#enable-azure').prop('checked', !!safari.extension.settings.GLB_Enabled);
    // get options
    var enableStatus;
    if (safari.extension.settings.GLB_Enabled === undefined)
        enableStatus = true;
    else
        enableStatus = !!safari.extension.settings.GLB_Enabled;
    $('#enable-azure').prop('checked', enableStatus);

    $('#enable-azure').change(function () {

        safari.extension.settings.GLB_Enabled = $(this).is(':checked');

        $('#azure-toast').removeClass('azure-toast-hidden');
        setTimeout(function () {
            $('#azure-toast').addClass('azure-toast-hidden');
        }, 2000);

    });

    $('#more-options').on('click', function () {
        safari.application.activeBrowserWindow.openTab().url = baseURL + 'html/options.html';
    });

    $('#open-waterlooworks').on('click', function () {
        safari.application.activeBrowserWindow.openTab().url = 'https://waterlooworks.uwaterloo.ca';
    });


}

initPopup();