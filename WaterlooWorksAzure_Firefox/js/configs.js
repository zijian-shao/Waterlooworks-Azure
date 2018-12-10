function getOptionVersion() {

    var optionVer = 1;
    return optionVer;

}

function getOptionListDefault() {

    var obj = {
        'EXT_Version': '0.0.0',
        'OPT_Version': 0,
        'JOB_Enabled': true,
        'JOB_ContextMenu': true,
        'JOB_OpenInNewTab': true,
        'JOB_FloatPagination': true,
        'JOB_FlipPageBackToTop': true,
        'JOB_FixTableHeader': true,
        'JOB_NewTagSwitch': true,
        'JOB_GlassdoorRanking': false,
        'JOB_EmptyShortlistButton': true,
        'JOB_ColumnDisplayType': 0,
        'JOB_ColumnSelected': ['action-buttons', 'app-status', 'id', 'job-title', 'organization', 'division', 'openings', 'position-type', 'internal-status', 'city', 'location', 'level', 'applications', 'app-deadline', 'not-interested'],
        'JOB_ShortlistedSwitch': true,
        'JOB_ShortlistExport': true,
        'JOB_FloatDetailPageButton': true,
        'JOB_FloatDetailPageInfo': true,
        'JOB_ListBatchOperation': true,
        'JOB_DetailPostingInfoPanel': true,
        'JOB_DetailPageFontSize': true,
        'JOB_DetailPageHighlight': true,
        'JOB_DetailPageHighlightKeywords': ['G2', 'driver\'s license'],
        'JOB_PopupModal': true,
        'JOB_PopupModalArrowKey': true,
        'JOB_PopupModalRows': {
            'row_0': {
                'name': 'Job Title',
                'display': true
            },
            'row_1': {
                'name': 'Organization',
                'display': true
            },
            'row_2': {
                'name': 'Region',
                'display': true
            },
            'row_3': {
                'name': 'Application Documents Required',
                'display': true
            },
            'row_4': {
                'name': 'Application Information',
                'display': true
            },
            'row_5': {
                'name': 'Application Method',
                'display': true
            },
            'row_6': {
                'name': 'Required Skills',
                'display': true
            },
            'row_7': {
                'name': 'Job Summary',
                'display': true
            },
            'row_8': {
                'name': 'Job Responsibilities',
                'display': true
            },
            'row_9': {
                'name': 'Compensation And Benefits',
                'display': true
            },
            'row_10': {
                'name': 'Position Type',
                'display': false
            },
            'row_11': {
                'name': 'Level',
                'display': false
            },
            'row_12': {
                'name': 'Job Openings',
                'display': false
            },
            'row_13': {
                'name': 'Job Category',
                'display': false
            },
            'row_14': {
                'name': 'Term Posted',
                'display': false
            },
            'row_15': {
                'name': 'Start Date',
                'display': false
            },
            'row_16': {
                'name': 'End Date',
                'display': false
            },
            'row_17': {
                'name': 'Career Development And Training',
                'display': false
            },
            'row_18': {
                'name': 'Targeted Degrees And Disciplines',
                'display': false
            },
            'row_19': {
                'name': 'Application Deadline',
                'display': false
            },
            'row_20': {
                'name': 'Application Delivery',
                'display': false
            },
            'row_21': {
                'name': 'Division',
                'display': false
            }
        },
        'MSG_Enabled': true,
        'MSG_OpenInNewTab': true,
        'MSG_FixTableHeader': false,
        'MSG_BetterColumn': true,
        'MSG_ShowCategory': true,
        'GLB_ReplaceLoginPage': true,
        'GLB_AutoRedirectToLogin': true,
        'GLB_BackToTopButton': true,
        'GLB_ReverseTitleOrder': true,
        'GLB_ThemeID': 0,
        'GLB_FontName': 'Muli||400,600,800||12',
        'GLB_LargerFont': false,
        'GLB_KeepLoggedIn': true,
        'GLB_Enabled': true
    };

    return obj;

}

function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "hidden": false,
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
            "hidden": false,
            "name": "Dark Turquoise",
            "name2": "(Night Mode)",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#282d34",
            "previewColor": "#09b1b9",
            "navbarPosition": "top",
            "navbarHeight": 60
        },
        "theme_2": {
            "id": 2,
            "hidden": false,
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
            "hidden": false,
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
            "hidden": false,
            "isNew": true,
            "name": "Dodger Blue",
            "author": "Zijian Shao & Tencent TIM",
            "brightness": "light",
            "overlayColor": "#fafafa",
            "previewColor": "#118dee",
            "navbarPosition": "top",
            "navbarHeight": 50
        },
        "theme_5": {
            "id": 5,
            "hidden": true,
            "name": "Daylight Aurora",
            "author": "Zijian Shao",
            "brightness": "light",
            "overlayColor": "#fff",
            "previewColor": "#0084ff",
            "navbarPosition": "top",
            "navbarHeight": 0
        },
        "theme_6": {
            "id": 6,
            "hidden": true,
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
            "hidden": false,
            "name": "Classic Carbon",
            "author": "Zijian Shao & Orbis Communications",
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