function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "name": "Bright Azure",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#ffffff",
            "previewColor": "#45b6f7",
            "navbarPosition": "top",
            "navbarHeight": 60
        },
        "theme_1": {
            "id": 1,
            "name": "Dark Turquoise",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#282d34",
            "previewColor": "#09b1b9",
            "navbarPosition": "top",
            "navbarHeight": 60
        },
        "theme_2": {
            "id": 2,
            "name": "Fresh Citrus",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fafafa",
            "previewColor": "#f4ad24",
            "navbarPosition": "left",
            "navbarHeight": 0
        },
        "theme_3": {
            "id": 3,
            "name": "Elegant Violet",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fafafa",
            "previewColor": "#8599de",
            "navbarPosition": "left",
            "navbarHeight": 0
        },
        "theme_4": {
            "id": 4,
            "name": "Daylight Aurora",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fff",
            "previewColor": "#0084ff",
            "navbarPosition": "top",
            "navbarHeight": 0
        },
        "theme_5": {
            "id": 5,
            "name": "Midnight Aurora",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#000",
            "previewColor": "#8599de",
            "navbarPosition": "top",
            "navbarHeight": 0
        },
        "theme_99": {
            "id": 99,
            "name": "Original Black",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#f1f1f1",
            "previewColor": "#1b1b1b",
            "navbarPosition": "top",
            "navbarHeight": 60
        }
    };

    if (id === undefined)
        return configs;
    else
        return configs["theme_" + id];

}