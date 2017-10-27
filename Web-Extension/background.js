var browser = browser || chrome;

/* control page action */
let fbUrlRegExp = new RegExp("^(http://|https://).*\.facebook\.com/");
let checkFbUrl = (tabId, changeInfo, tab) => {
    if (fbUrlRegExp.test(tab.url)) {
        browser.pageAction.show(tabId);
    }
};

browser.tabs.onUpdated.addListener(checkFbUrl);

/* prepare tracking constant */
let tracker = undefined;
console.log(test);
browser.storage.local.get({'qclean-anonymous-client-id': ''}, (items) => {
    let anonymousClientId = items['qclean-anonymous-client-id'];
    if (anonymousClientId.length != 16) {
        anonymousClientId = ('0000000000000000' + Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16)).substr(-16);
        browser.storage.local.set({'qclean-anonymous-client-id': anonymousClientId}, () => {
            console.log(`set ${anonymousClientId} as anonymous client id`);
        });
    }
    console.log(`clientId = ${anonymousClientId}`);
});

// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

//read https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id#disabling_cookies for more information.
ga('create', 'UA-3607701-10', {'storage': 'none'});
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask', null);
ga('send', 'pageview');
var manifest = chrome.runtime.getManifest();
ga('send', 'event', 'ChromeExtVersion',manifest.version);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    //console.log("get message");
    //console.log(request);
    //console.log(sender);
    //console.log(sendResponse);
    if (request.request == "i13n") {
        var event = request.event;
        if (event == "QCLeanDidLoad") {
            ga('send', 'event', event, manifest.version);
        } else if (event == "CannotHideTargetElement") {
            ga('send', 'event', event, request.type, manifest.version); 
        } else if (event == "CollaspeDidTapped") {
            ga('send', 'event', event, manifest.version);
        }
    }
});
