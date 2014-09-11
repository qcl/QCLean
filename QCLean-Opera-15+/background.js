var qclean_version = "0.4.0.1";

var qclean_fb_url_regexp = new RegExp("^(http://|https://).*\.facebook\.com/");

function qclean_check_fb_url(tabId, changeInfo, tab) {
    if(qclean_fb_url_regexp.test(tab.url)){ 
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(qclean_check_fb_url);

