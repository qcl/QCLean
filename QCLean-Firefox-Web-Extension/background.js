var qclean = qclean || {};
qclean.version = "0.4.5.7";

/* Default Settings */
//version information
if(localStorage["qclean-version"] == undefined||localStorage["qclean-version"]!=qclean.version){
    localStorage["qclean-version"] = qclean.version;
}
//remove games you may like
if(localStorage["qclean-rmg"]==undefined){
    localStorage["qclean-rmg"] = "true";
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
//report data to qclean
if(localStorage["qclean-report"]==undefined){
    localStorage["qclean-report"] = "true";
}

//show popup
qclean.fbUrlRegExp = new RegExp("^(http://|https://).*\.facebook\.com/");
qclean.checkFbUrl = function(tabId, changeInfo, tab){
    if(qclean.fbUrlRegExp.test(tab.url)){ 
        chrome.pageAction.show(tabId);
    }
};
chrome.tabs.onUpdated.addListener(qclean.checkFbUrl);

/* Google Analytics */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3607701-10', 'auto');
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask', null);
ga('send', 'pageview');
ga('send', 'event', 'ChromeExtVersion',qclean.version);

/* chrome messages */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

    //console.log("getMessage.");
    //console.log(request);
    //console.log(sender);
    //console.log(sendResponse);

    if(request.request == "getSettings"){
    
        sendResponse({
            "rmg" :localStorage["qclean-rmg"],
            "rmad":localStorage["qclean-rmad"],
            "rmrp":localStorage["qclean-rmrp"],
            "hr"  :localStorage["qclean-hr"],
            "hs"  :localStorage["qclean-hs"],
            "report":localStorage["qclean-report"]
        });
    }

});
