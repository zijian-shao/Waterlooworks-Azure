function startAzureEmployer() {
    $('#azure-body-hide').remove();
    $('#azure-load-cover').delay(300).fadeOut(300, function () {
        $('#azure-load-cover').remove();
    });
}

startAzureEmployer();