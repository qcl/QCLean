var qclean_version = "0.2.7";

var qclean_fb_url_regexp = new RegExp("^(http://|https://).*\.facebook\.com/");

function qclean_check_fb_url(tabId, changeInfo, tab) {
    if(qclean_fb_url_regexp.test(tab.url)){ 
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(qclean_check_fb_url);

/* GA */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3607701-4']);
_gaq.push(['_trackPageview']);

_gaq.push(['_trackEvent','ChromeExtVersion',qclean_version]);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


