function initPopup() {

    chrome.storage.sync.get({
        GLB_Enabled: true
    }, function (items) {
        $('#enable-azure').prop('checked', items.GLB_Enabled);
    });

    $('#enable-azure').change(function () {

        chrome.storage.sync.set({

            GLB_Enabled: $(this).is(':checked')

        }, function () {

            $('#azure-toast').removeClass('azure-toast-hidden');
            setTimeout(function () {
                $('#azure-toast').addClass('azure-toast-hidden');
            }, 2000);

        });

    });

    $('#more-options').on('click', function () {
        chrome.runtime.openOptionsPage();
    });

    $('#open-waterlooworks').on('click', function () {
        chrome.tabs.create({
            url: 'https://waterlooworks.uwaterloo.ca'
        });
    });

}

initPopup();