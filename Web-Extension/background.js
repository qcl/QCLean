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
let clientId = undefined;
let trackable = false;
let optInShown = undefined;
let requests = [];
var manifest = browser.runtime.getManifest();

let showOptInIfNeeded = (isTrackable, isShown) => {
    if (isTrackable === undefined || isShown === undefined) {
        return;
    }

    if (!isShown) {
        if (!isTrackable) {
            browser.tabs.create({url: 'options.html?opt-in=1'});
        }
        optInShown = true;
        browser.storage.local.set({'qclean-optin-shown': true}, () => {
            console.log('qclean-optin-shown set to true');
        });
    }
};

browser.storage.local.get({'qclean-anonymous-client-id': '','qclean-optin-shown': false}, (items) => {
    let anonymousClientId = items['qclean-anonymous-client-id'];
    if (anonymousClientId.length != 16) {
        anonymousClientId = ('0000000000000000' + Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(16)).substr(-16);
        browser.storage.local.set({'qclean-anonymous-client-id': anonymousClientId}, () => {
            //console.log(`set ${anonymousClientId} as anonymous client id`);
        });
    }
    //console.log(`clientId = ${anonymousClientId}`);
    clientId = anonymousClientId;

    optInShown = items['qclean-optin-shown'];
    console.log(optInShown);
    showOptInIfNeeded(trackable, optInShown);
});

browser.storage.sync.get({'qclean-auto-report': false}, (items) => {
    let autoReport = items['qclean-auto-report'];
    console.log(`trackable = ${autoReport}`);
    trackable = autoReport;
    showOptInIfNeeded(trackable, optInShown);
});

browser.storage.onChanged.addListener((changes, area) => {
    let changedItems = Object.keys(changes);
    for (let item of changedItems) {
        //console.log(item);
        if (item == 'qclean-auto-report') {
            trackable = changes[item].newValue;
            //console.log(`${item} -> ${trackable}`);
        }
    }
});

let trackingId = 'UA-3607701-10';

let logEvent = (tId, cId, eventCategory, eventAction, eventLabel = undefined, eventValue = undefined) => {
    let paras = {
        'v': '1',
        'tid': tId,
        'cid': cId,
        't': 'event',
        'ec': 'anonymous-' + eventCategory,
        'ea': eventAction
    };
    //console.log(paras);
    if (eventLabel) {
        paras['el'] = eventLabel;
    }
    if (eventValue) {
        paras['ev'] = eventValue;
    }

    let para = [];

    for (let key in paras) {
        let value = paras[key];
        para.push(`${key}=${value}`);
    }

    let message = para.join('&');
    //console.log(message);

    let request = new XMLHttpRequest();
    request.open('POST', 'https://www.google-analytics.com/collect', true);
    request.send(message);
}; 

let handleI13NRequest = (request) => {
    if (!trackable) {
        console.log('not trackable');
        return;
    }

    //console.log(request);
    var event = request.event;
    if (event == "QCLeanDidLoad") {
        logEvent(trackingId, clientId, event, manifest.version);
    } else if (event == "CannotHideTargetElement") {
        logEvent(trackingId, clientId, event, request.type, manifest.version);
    } else if (event == "CollaspeDidTapped") {
        logEvent(trackingId, clientId, event, manifest.version);
    } else if (event == 'OpenSettingFromPopup') {
        logEvent(trackingId, clientId, event, manifest.version);
    } else if (event == 'ReportBugFromPopup' ) {
        logEvent(trackingId, clientId, event, manifest.version);
    } else if (event == 'OpenPopupPage') {
        logEvent(trackingId, clientId, event, manifest.version);
    }
};

browser.runtime.onMessage.addListener(function(request, sender, sendResponse){
    //console.log("get message");
    //console.log(request);
    //console.log(sender);
    //console.log(sendResponse);

    if (request.request == "i13n") {
        if (clientId === undefined) {
            requests.push(request);
        } else {
            if (requests.length > 0) {
                for (var req of requests) {
                    handleI13NRequest(req);
                }
                requests = [];
                console.log('clean queue');
            }
            handleI13NRequest(request);
        }
    }
});
