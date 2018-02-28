/*
 *  QCLean - experiment
 */

var browser = browser || undefined;
var chrome = browser || chrome;
var qclean = qclean || {};
var manifest = chrome.runtime.getManifest();
var extensionInfo = {
        "version": manifest.version
};

qclean.version = extensionInfo.version;

console.log("Load qclean.js ("+qclean.version+")");

/* QCLean settings */
qclean.setting = qclean.setting || {};
qclean.setting.isInit = false;

/* QCLean i13n */
qclean.i13n = qclean.i13n || {};
qclean.i13n.logEvent = function(eventObj) {
    if (qclean.setting.isAutoReport) {
        eventObj["request"] = "i13n";
        //console.log(eventObj);
        chrome.runtime.sendMessage(eventObj, function(response){
            // no-op for now.
        });
    }
};

// init setting
// TODO integrage it with setting in option
// FIXME chrome only
chrome.storage.sync.get({
    "qclean-remove-ads": true,
    "qclean-remove-recommended-posts": true,
    "qclean-collaspe-right-panel": true,
    "qclean-remove-games": true,
    "qclean-auto-report": true,
    "qclean-debug-mode": false,
}, function(items){
    qclean.setting.isRemoveAds = items["qclean-remove-ads"];
    qclean.setting.isRemoveSponsoredPosts = items["qclean-remove-recommended-posts"];
    qclean.setting.isCollaspeRightPanelContent = items["qclean-collaspe-right-panel"];
    qclean.setting.isRemoveGames = items["qclean-remove-games"];
    qclean.setting.isAutoReport = items["qclean-auto-report"];
    qclean.setting.isDebug = items["qclean-debug-mode"];
    qclean.setting.isInit = true;
    console.log("Load qclean settings");
    //console.log(qclean.setting);
    qclean.i13n.logEvent({event: "QCLeanDidLoad"});
});

/* QCLean judge functions */
qclean.hiding = qclean.hiding || {};

// FIXME: rename this method, it's a method that judge a element is or not a story on facebook newsfeed.
qclean.hiding.isSponsoredStoryOnNewsFeed = function(element) {
    if( (element.dataset.ft && JSON.parse(element.dataset.ft).mf_story_key) || 
        (element.dataset.testid && element.dataset.testid == "fbfeed_story") ){
        return true;
    }
    return false;
};

qclean.hiding.isSponsoredADs = function(element){
    if(element.className=="ego_section"){
        return true;
    }
    return false;
};

qclean.hiding.isGameInChatBar = function (element) {
    return (element.id == "pagelet_canvas_nav_content"); 
};

/* QCLean collaspe header and container functions */
qclean.collaspe = qclean.collaspe || {};

qclean.collaspe.contentComponentFinder = function (element) {
    //var header = element.querySelector(".uiHeaderTitle");
    var container = element.querySelector(".ego_unit_container");

    if (container) {
        return container;
    }

    return undefined;
};

qclean.collaspe.contentHandler = function (event) {
    // no-op
};

/* QCLean */

qclean.feature = qclean.feature || {};

// Feature: hide sponsored story on news feed
qclean.feature.hideSponsoredStoryOnNewsFeed = {
    "type"          : "hide",
    "judgeFunction" : qclean.hiding.isSponsoredStoryOnNewsFeed,
    "name"          : "hideSponsoredStoryOnNewsFeed",
    "description"   : "Hide sponsored story on news feed"
};

// Feature: hide sponsored ADs
qclean.feature.hideSponsoredADs = {
    "type"          : "hide",
    "judgeFunction" : qclean.hiding.isSponsoredADs,
    "name"          : "hideSponsoredADs",
    "description"   : "Hide sponsored AD on photo view and persional view"
};

// Feature: hide recommended game in chat bar
qclean.feature.hideRecommendedGameInChatBar = {
    "type"          : "hide",
    "judgeFunction" : qclean.hiding.isGameInChatBar,
//  "afterHidingHandler" : qclean.hiding.adjustChatBodyHeight,
    "name"          : "hideRecommendedGameInChatBar",
    "description"   : "Hide recommended game in chat bar"
};

// Feature: collaspe contnet
qclean.feature.collaspeSidebarContent = {
    "type"          : "collaspe",
    "componentFinder" : qclean.collaspe.contentComponentFinder,
    "collaspeHandler" : qclean.collaspe.contentHandler,
    "name"          : "collaspeSidebarContent",
    "description"   : "Collaspe sidebar content"
};

// Feature: collaspe recommended games
// TODO
qclean.feature.collaspeRecommendedGame = {
    "type"          : "collaspe",
    "componentFinder" : undefined,
    "collaspeHandler" : undefined,
    "name"          : "collaspeRecommendedGame",
    "description"   : "Collaspe recommended game"
};

/* QCLean hide element framework */

qclean.framework = qclean.framework || {};

qclean.framework._hideElementByTargetChild = function(target, featureDesc){
    var element = target;
    if(!target.dataset.qclean){
        while(element!=null&&element!=undefined){
            if(featureDesc.judgeFunction(element)){
                if(featureDesc.type == "hide") {
                    if(qclean.setting.isDebug) {
                        element.style.border = "2px solid red";
                    } else {
                        element.style.display = "none";
                    }
                    target.dataset.qclean = "done";
                    console.log("Hide something ("+featureDesc.name+")");
                    //if (featureDesc.afterHidingHandler) {
                    //    featureDesc.afterHidingHandler();
                    //}
                }
                break;
            }
            element = element.parentElement;
        }
    }
    if(!target.dataset.qclean && featureDesc.type == "hide"){
        // here means qclean didn't hide our target element.
        qclean.i13n.logEvent({
            event   : "CannotHideTargetElement",
            type    : featureDesc.name
        });
        // here may cause too many log event, so just mark it as done.
        target.dataset.qclean = "done";
    }
};

qclean.framework.hideElementsByTargetChildSelector = function(selectors, featureDesc){
    var targetChilds = document.querySelectorAll(selectors);
    for(var i=0; i<targetChilds.length; i++){
        if(!targetChilds[i].dataset.qclean){
            qclean.framework._hideElementByTargetChild(targetChilds[i], featureDesc);
        }
    }
};

qclean.framework._setupCollaspeComponent = function(component, handler) {
    var container = component;

    if (!container.dataset.qcleanCollaspe) {
        console.log("add new collaspe area");
        container.classList.add("qcleanHide");
        container.dataset.qcleanCollaspe = "true";
        // FIXME: make it can be opend again, not just hide.
        /*
        header.dataset.qcleanCollaspe = "true";
        header.qcleanCollaspeContainer = container;
        header.onclick = function (event) {
            handler(event);
            if (this.dataset.qcleanCollaspe == "true") {
                this.qcleanCollaspeContainer.classList.remove("qcleanHide");
                this.dataset.qcleanCollaspe = "false";
            } else {
                this.qcleanCollaspeContainer.classList.add("qcleanHide");
                this.dataset.qcleanCollaspe = "true";
            }
            qclean.i13n.logEvent({
                event: "CollaspeDidTapped"
            });
        }
        */
    }
};

qclean.framework._collaspeElement = function(element, featureDesc) {
    var component = featureDesc.componentFinder(element);
    if (component) {
        qclean.framework._setupCollaspeComponent(component, featureDesc.collaspeHandler);
        element.dataset.qclean = "done";
    }
};

qclean.framework.collaspeElementsBySelector = function(selector, featureDesc) {
    var targetAreas = document.querySelectorAll(selector);
    for (var i = 0; i < targetAreas.length; i++) {
        if (!targetAreas[i].dataset.qclean) {
            qclean.framework._collaspeElement(targetAreas[i], featureDesc); 
        }
    }
};

/* Mutation observer */

var qcleanObserver = new window.MutationObserver(function(mutation, observer){
    //console.log("Observer triggered");
    if (qclean.setting.isInit) {
        // hide sponsored story on newsfeed
        if (qclean.setting.isRemoveSponsoredPosts) {
            qclean.framework.hideElementsByTargetChildSelector(".uiStreamAdditionalLogging:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // new type sponsored post's structure:
            // <h4> or <h5>
            // <div>
            //     <span>
            //         <a href="https://l.facebook.com/l.php?u="
            //         <!-- it's a link to https://www.facebook.com/ads/about -->
            //     </span>
            //     <span>
            //     <a>
            // </div>
            //qclean.framework.hideElementsByTargetChildSelector("div>span>a[href^='https://l.facebook.com/l.php?']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // there is a newer type sponsored post structure:
            // <h5> or <h6>
            // <div>
            //     <span>
            //         <div>
            //             <a href="https://l.facebook.com/l.php?u="
            //             <!-- it's a link to https://www.facebook.com/ads/about -->
            //         </div>
            //     </span>
            //     <span>
            //     <a>
            // </div>
            qclean.framework.hideElementsByTargetChildSelector("h6+div>span>div>a[href^='https://l.facebook.com/l.php?']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);
            qclean.framework.hideElementsByTargetChildSelector("h5+div>span>div>a[href^='https://l.facebook.com/l.php?']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // more newer type sponsored post sturesture:
            // <h5> or <h6>
            // <div>
            //    <span>
            //        <div>
            //            <a href="#"
            //        <div>
            //    </span>
            //    <span>
            //    <a>
            // </div>
            qclean.framework.hideElementsByTargetChildSelector("h6+div>span>div>a[href^='#']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);
            qclean.framework.hideElementsByTargetChildSelector("h5+div>span>div>a[href^='#']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // 2017.10.21 update
            // <h5> or <h6>
            // <div>
            //     <span>
            //         <div>
            //             <div>
            //                 <a href="#"
            //             </div>
            //         </div>
            //     </span>
            // </div>

            qclean.framework.hideElementsByTargetChildSelector("h6+div>span>div>div>a[href^='#']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);
            qclean.framework.hideElementsByTargetChildSelector("h5+div>span>div>div>a[href^='#']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);
        }

        // hide sponsored ADs
        if (qclean.setting.isRemoveAds) {
            qclean.framework.hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", qclean.feature.hideSponsoredADs);

            // create ad's button's link: /campaign/landing.php?placement=emuca&campaign_id=282141474901&extra_1=auto
            qclean.framework.hideElementsByTargetChildSelector("a[href^='/campaign/landing.php']:not([data-qclean])", qclean.feature.hideSponsoredADs);

            // create ad's button's link: /ad_campaign/landing.php?placement=emuca&campaign_id=282141474901&extra_1=auto
            qclean.framework.hideElementsByTargetChildSelector("a[href^='/ad_campaign/landing.php']:not([data-qclean])", qclean.feature.hideSponsoredADs);
        }

        // collaspe sidebar content
        if (qclean.setting.isCollaspeRightPanelContent) {
            qclean.framework.collaspeElementsBySelector(".ego_section:not([data-qclean]):not([style])", qclean.feature.collaspeSidebarContent); 
        }

        // hide recommended game in chat bar
        if (qclean.setting.isRemoveGames) {
            qclean.framework.hideElementsByTargetChildSelector("#pagelet_canvas_nav_content:not([data-qclean])", qclean.feature.hideRecommendedGameInChatBar);
        }
    }
});

qcleanObserver.observe(document, {
    subtree: true,
    childList: true
});
