/*
function onRequest(request,sender,sendResponse){
    //chrome.pageAction.show(sender.tab.id);
    sendResponse({});
};

//chrome.extension.onRequest.addListener(onRequest);
*/
var regexp = new RegExp("^(http://|https://).*\.facebook\.com/");

function checkForValidUrl(tabId, changeInfo, tab) {
    if(regexp.test(tab.url)){ 
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);

//var xmlHttp = new XMLHttpRequest();
//xmlHttp.open( "GET", 'http://qcl.github.com/NoFacebookPageRecommend/poke.html', false );
//xmlHttp.send( null );


