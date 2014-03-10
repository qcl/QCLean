var qclean = qclean || {};
qclean.version = "0.4";

/* Default Settings */
//version information
if(localStorage["qclean-version"] == undefined||localStorage["qclean-version"]!=qclean.version){
    localStorage["qclean-version"] = qclean.version;
}
//remove ads
if(localStorage["qclean-rmad"]==undefined){
    localStorage["qclean-rmad"] = "true";
}
//remove recommend pages/posts/games
if(localStorage["qclean-rmrp"]==undefined){
    localStorage["qclean-rmrp"] = "true";
}
//hide recommend
if(localStorage["qclean-hr"]==undefined){
    localStorage["qclean-hr"] = "true";
}
//hide Line shopping taggings 
if(localStorage["qclean-hs"]==undefined){
    localStorage["qclean-hs"] = "false";
}

//show popup
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
    ga.src = 'https://stats.g.doubleclick.net/dc.js';
    //ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/* chrome messages */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    console.log("getMessage.");
    console.log(request);
    console.log(sender);
    console.log(sendResponse);

    if(request.request == "getSettings"){
    
        sendResponse({
            "rmad":localStorage["qclean-rmad"],
            "rmrp":localStorage["qclean-rmrp"],
            "hr"  :localStorage["qclean-hr"],
            "hs"  :localStorage["qclean-hs"]
        });
    }

});
