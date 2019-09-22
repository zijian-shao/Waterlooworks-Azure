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
        'JOB_AutoCollapseMultiSelect': true,
        'JOB_FloatPagination': true,
        'JOB_FlipPageBackToTop': true,
        'JOB_FixTableHeader': true,
        'JOB_NewTagSwitch': true,
        'JOB_GlassdoorRanking': true,
        'JOB_EmptyShortlistButton': true,
        'JOB_ColumnDisplayType': 0,
        'JOB_ColumnSelected': ['action-buttons', 'app-status', 'id', 'job-title', 'organization', 'division', 'openings', 'position-type', 'internal-status', 'city', 'location', 'level', 'applications', 'app-deadline', 'not-interested'],
        'JOB_ShortlistedSwitch': true,
        'JOB_ShortlistExport': true,
        'JOB_ApplicationExport': true,
        'JOB_FloatDetailPageButton': true,
        'JOB_FloatDetailPageInfo': true,
        'JOB_ListBatchOperation': true,
        'JOB_DetailPostingInfoPanel': true,
        'JOB_DetailPageFontSize': true,
        'JOB_DetailPageHighlight': true,
        'JOB_DetailPageHighlightKeywords': ['G2', 'driver\'s license'],
        'JOB_PopupModal': true,
        'JOB_PopupModalCapitalTitle': true,
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
                'name': 'Job Requirements',
                'display': true
            },
            'row_7': {
                'name': 'Required Skills',
                'display': true
            },
            'row_8': {
                'name': 'Job Summary',
                'display': true
            },
            'row_9': {
                'name': 'Job Responsibilities',
                'display': true
            },
            'row_10': {
                'name': 'Compensation And Benefits',
                'display': true
            },
            'row_11': {
                'name': 'Position Type',
                'display': false
            },
            'row_12': {
                'name': 'Level',
                'display': false
            },
            'row_13': {
                'name': 'Job Openings',
                'display': false
            },
            'row_14': {
                'name': 'Job Category',
                'display': false
            },
            'row_15': {
                'name': 'Term Posted',
                'display': false
            },
            'row_16': {
                'name': 'Start Date',
                'display': false
            },
            'row_17': {
                'name': 'End Date',
                'display': false
            },
            'row_18': {
                'name': 'Career Development And Training',
                'display': false
            },
            'row_19': {
                'name': 'Targeted Degrees And Disciplines',
                'display': false
            },
            'row_20': {
                'name': 'Application Deadline',
                'display': false
            },
            'row_21': {
                'name': 'Application Delivery',
                'display': false
            },
            'row_22': {
                'name': 'Division',
                'display': false
            }
        },
        'MSG_Enabled': true,
        'MSG_OpenInNewTab': true,
        'MSG_FixTableHeader': false,
        'MSG_BetterColumn': true,
        'MSG_ShowCategory': true,
        'APPT_HomeNavTile': true,
        'APPT_AutoFoldTerm': true,
        'APPT_SwitchTermAndLink': false,
        'APPT_AutoEnterBookPage': false,
        'APPT_AutoHideTypeIntro': true,
        'GLB_ReplaceLoginPage': true,
        'GLB_AutoRedirectToLogin': true,
        'GLB_BackToTopButton': true,
        'GLB_ReverseTitleOrder': true,
        'GLB_ThemeID': 0,
        'GLB_FontName': 'Muli||400,600,800||12',
        'GLB_LargerFont': false,
        'GLB_KeepLoggedIn': true,
        'GLB_Enabled': true,
        'DASH_HideCampusConnectBadge': true,
        'DASH_HideCampusConnect': false
    };

    return obj;

}

function getThemeConfigs(id) {

    var configs = {
        "theme_0": {
            "id": 0,
            "sort_id": 0,
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
            "sort_id": 1,
            "hidden": false,
            "name": "Dark Turquoise",
            "name2": "(Dark Mode)",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#282d34",
            "previewColor": "#09b1b9",
            "navbarPosition": "top",
            "navbarHeight": 60
        },
        "theme_2": {
            "id": 2,
            "sort_id": 8,
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
            "sort_id": 2,
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
            "sort_id": 4,
            "hidden": false,
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
            "sort_id": 3,
            "parent_id": 3,
            "isNew": true,
            "hidden": false,
            "name": "Ebony Clay",
            "name2": "(Dark Mode)",
            "author": "Zijian Shao",
            "brightness": "dark",
            "overlayColor": "#1f1f1f",
            "previewColor": "#465072",
            "navbarPosition": "left",
            "navbarHeight": 0
        },
        "theme_6": {
            "id": 6,
            "sort_id": 5,
            "parent_id": 4,
            "isNew": true,
            "hidden": false,
            "name": "Chathams Blue",
            "name2": "(Dark Mode)",
            "author": "Zijian Shao & Tencent TIM",
            "brightness": "light",
            "overlayColor": "#1f1f1f",
            "previewColor": "#2C5971",
            "navbarPosition": "top",
            "navbarHeight": 50
        },
        "theme_98": {
            "id": 98,
            "sort_id": 7,
            "parent_id": 99,
            "isNew": true,
            "hidden": false,
            "name": "Minimalist Gray",
            "name2": "(Dark Mode)",
            "author": "Zijian Shao & Orbis Communications",
            "brightness": "dark",
            "overlayColor": "#1f1f1f",
            "previewColor": "#1b1b1b",
            "navbarPosition": "top",
            "navbarHeight": 60
        },
        "theme_99": {
            "id": 99,
            "sort_id": 6,
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

function getLink(key) {
    var list = {
        darklightStore: 'https://chrome.google.com/webstore/detail/learn-darklight/lhodieepeghcemhpbloffmljoklaklho',
        azureStore: 'https://chrome.google.com/webstore/detail/waterlooworks-azure/peeaakkcmdoeljddgdkcailflcballmm',
        azureStoreReviewSuffix: '/reviews',
        autologStore: 'https://chrome.google.com/webstore/detail/waterloo-autolog/ncpmlgiinkikhgijoplpnjggobinhkpl',
        raspberryStore: 'https://chrome.google.com/webstore/detail/quest-raspberry/ifhnmgllkaeebiklhakndljclagikoak',
        feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSfXzHmscryMryP_LyaRKdNDVUKBz_9NTdVGOSnlEQEBZDPUoQ/viewform?usp=pp_url&entry.775641191=@@extVersion@@&entry.424865672=@@browser@@&entry.1807838560=@@os@@',
        officialWebsite: 'https://www.zijianshao.com/wwazure/',
        github: 'https://github.com/SssWind/Waterlooworks-Azure',
        donate: 'https://www.paypal.me/zjshao',
        linkShare: 'https://www.zijianshao.com/wwazure/sharelink/?platform=chrome',
        facebookShare: 'https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2Fsharelink%2F%3Fplatform%3Dchrome&display=popup&ref=plugin&src=share_button',
        twitterShare: 'https://twitter.com/intent/tweet?hashtags=UWaterloo&original_referer=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2F&ref_src=twsrc%5Etfw&text=WaterlooWorks%20Azure%20-%20The%20best%20browser%20extension%20to%20enhance%20experience%20with%20WaterlooWorks&tw_p=tweetbutton&url=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2Fsharelink%2F%3Fplatform%3Dchrome',
        redditShare: 'https://www.reddit.com/submit?url=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2Fsharelink%2F%3Fplatform%3Dchrome&title=WaterlooWorks+Azure+-+The+best+browser+extension+to+enhance+experience+with+WaterlooWorks',
        gplusShare: 'https://plus.google.com/share?url=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2Fsharelink%2F%3Fplatform%3Dchrome',
        linkedInShare: 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.zijianshao.com%2Fwwazure%2Fsharelink%2F%3Fplatform%3Dchrome',
        mailTo: 'mailto:sam.zj.shao@gmail.com?Subject=WaterlooWorks Azure Extension',
        waterlooWorksLink: 'https://waterlooworks.uwaterloo.ca',
        uninstall: 'https://www.zijianshao.com/wwazure/uninstall/?platform=@@platform@@&version=@@extVersion@@&browser=@@browser@@&os=@@os@@'
    };
    return list[key];
}