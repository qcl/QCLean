/*
 *  QCLean - experiment
 */

var qclean = qclean || {};
// TODO: support mutiple brwoser.
var manifest = chrome.runtime.getManifest();

qclean.version = manifest.version;

console.log("Load qclean.js ("+qclean.version+")");

/* QCLean judge functions */
qclean.judgeFunction = qclean.judgeFunction || {};

qclean.judgeFunction.sponsoredStoryOnNewsFeed = function(element) {
    if(element.dataset.ft && JSON.parse(element.dataset.ft).mf_story_key){
        return true;
    }
    return false;
};

qclean.judgeFunction.sponsoredADs = function(element){
    if(element.className=="ego_section"){
        return true;
    }
    return false;
};

/* QCLean */

qclean.feature = qclean.feature || {};

// Feature: hide sponsored story on news feed
qclean.feature.hideSponsoredStoryOnNewsFeed = {
    "judgeFunction" : qclean.judgeFunction.sponsoredStoryOnNewsFeed,
    "name"          : "hideSponsoredStoryOnNewsFeed",
    "description"   : "Hide sponsored story on news feed"
};

// Feature: hide sponsored ADs
qclean.feature.hideSponsoredADs = {
    "judgeFunction" : qclean.judgeFunction.sponsoredADs,
    "name"          : "hideSponsoredADs",
    "description"   : "Hide sponsored AD on photo view and persional view"
};

/* QCLean hide element framework */

qclean.framework = qclean.framework || {};

qclean.framework._hideElementByTargetChild = function(target, featureDesc){
    var element = target;
    if(!target.dataset.qclean){
        while(element!=null&&element!=undefined){
            if(featureDesc.judgeFunction(element)){
                element.style.display = "none";
                target.dataset.qclean = "done";
                console.log("Hide something ("+featureDesc.name+")");
                break;
            }
            element = element.parentElement;
        }
    }
    /*
    if(!target.dataset.qclean){
        //here means qclean didn't hide our target element.
        //TODO I13N
    }
    */
};

qclean.framework.hideElementsByTargetChildSelector = function(selectors, featureDesc){
    var targetChilds = document.querySelectorAll(selectors);
    //if(targetChilds.length>0){
    //    console.log(targetChilds.length);
    //}
    for(var i=0; i<targetChilds.length; i++){
        if(!targetChilds[i].dataset.qclean){
            qclean.framework._hideElementByTargetChild(targetChilds[i], featureDesc);
        }
    }
};

/* Mutation observer */

var qcleanObserver = new window.MutationObserver(function(mutation, observer){
    //console.log("Observer triggered");

    // hide sponsered story on newsfeed
    qclean.framework.hideElementsByTargetChildSelector(".uiStreamAdditionalLogging:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

    // hide sponsered ADs
    qclean.framework.hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", qclean.feature.hideSponsoredADs);
});

qcleanObserver.observe(document, {
    subtree: true,
    childList: true
});
