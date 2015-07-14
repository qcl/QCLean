// Control page action
var fbUrlRegExp = new RegExp("^(http://|https://).*\.facebook\.com/");
var checkFbUrl = function (tabId, changeInfo, tab) {
    if (fbUrlRegExp.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkFbUrl);
