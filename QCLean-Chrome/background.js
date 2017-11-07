// Control page action
var fbUrlRegExp = new RegExp("^(http://|https://).*\.facebook\.com/");
var checkFbUrl = function (tabId, changeInfo, tab) {
    if (fbUrlRegExp.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkFbUrl);

// Google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3607701-10', 'auto');
ga('create', 'UA-108805975-2', 'auto', 'spTracker');    // sponsored post tracker
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask', null);
ga('spTracker.set','checkProtocolTask', null);
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
        } else if (event == "LearningFromPost") {
            ga('send', 'event', event, request.type, request.content); 
        } else if (event == "CannotHideTargetElement") {
            ga('send', 'event', event, request.type, manifest.version); 
        } else if (event == "CollaspeDidTapped") {
            ga('send', 'event', event, manifest.version);
        } else if (event == "AdSampleForLearning") {
            if (request.content && request.content.length > 0 && request.content.length < 8000) {
                ga('send', 'event', event, request.type, request.content);
            }/* else {
                console.log('content err');
            }*/
        } else if (event == "SponsoredPost") {
            var dimensionObj = {
                'dimension1': request.page,
                'dimension2': request.post
            };
            if (request.link && request.link.length > 0) {
                dimensionObj['dimension3'] = request.link;
            }
            //console.log(request);
            ga('spTracker.send', 'event', 'SponsoredPost', 'DidAppear', dimensionObj);
        }
    }
});
