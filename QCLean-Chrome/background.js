var qclean = qclean || {};

qclean.version = "0.3.1";
qclean.fbUrlRegExp = new RegExp("^(http://|https://).*\.facebook\.com/");
qclean.checkFbUrl = function(tabId, changeInfo, tab){
    if(qclean.fbUrlRegExp.test(tab.url)){ 
        chrome.pageAction.show(tabId);
    }
};
chrome.tabs.onUpdated.addListener(qclean.checkFbUrl);

/* GA */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3607701-4']);
_gaq.push(['_trackPageview']);

_gaq.push(['_trackEvent','ChromeExtVersion',qclean.version]);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


