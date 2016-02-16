/*
 *  QCLean - experiment
 */

var qclean = qclean || {};
// TODO: support safari/opera
var extensionInfo = undefined;
if (self.options) {
    //console.log("Firefox");
    //console.log(self.options);
    extensionInfo = {
        "version": self.options.version
    };
} else if (chrome) {
    //console.log("Chrome");
    var manifest = chrome.runtime.getManifest();
    extensionInfo = {
        "version": manifest.version
    };
}

qclean.version = extensionInfo.version;

console.log("Load qclean.js ("+qclean.version+")");

/* QCLean judge functions */
qclean.hiding = qclean.hiding || {};

qclean.hiding.isSponsoredStoryOnNewsFeed = function(element) {
    if(element.dataset.ft && JSON.parse(element.dataset.ft).mf_story_key){
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
    var header = element.querySelector(".uiHeaderTitle");
    var container = element.querySelector(".ego_unit_container");

    if (header && container) {
        return {
            "header"    : header,
            "container" : container,
            "title"     : header
        };
    }

    return undefined;
};

qclean.collaspe.contentHandler = function (event) {
    // no-op
};

/* QCLean */

qclean.feature = qclean.feature || {};

// Feature: learning ad links on news feed
qclean.feature.machineLearningLinksOnNewsFeed = {
    "type"          : "learn",
    "judgeFunction" : qclean.hiding.isSponsoredStoryOnNewsFeed,
    "name"          : "machineLearningLinksOnNewsFeed",
    "description"   : "Learning from links"
};

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
                    element.style.display = "none";
                    target.dataset.qclean = "done";
                    console.log("Hide something ("+featureDesc.name+")");
                    //if (featureDesc.afterHidingHandler) {
                    //    featureDesc.afterHidingHandler();
                    //}
                } else if (featureDesc.type == "learn") {
                    // TODO - extract content
                    var links = element.querySelectorAll("a");
                    if (links.length == 0) {
                        // facebook not load info yet.
                    } else {
                        var fetchedLink = undefined;
                        target.dataset.qclean = "done";
                        links = element.querySelectorAll("a[onclick][href*=http][tabindex]");
                        for (var i=0; i < links.length; i++) {
                            var link = links[i];
                            var href = link.attributes["onclick"].value;
                            var hrefComponents = href.split("referrer_log(this, \"");
                            if (hrefComponents.length > 1) {
                                href = hrefComponents[1];
                                hrefComponents = href.split("\", \"\\/si\\/ajax\\");
                                href = hrefComponents[0];
                                href = href.replace(/\\u([\d\w]{4})/gi, function(match, grp){
                                    return String.fromCharCode(parseInt(grp, 16));
                                });
                                href = href.replace(/\\\//gi, "/");
                                if (href != undefined && href.length > 0) {
                                    fetchedLink = href;
                                }
                            }
                            if (fetchedLink != undefined) {
                                console.log(fetchedLink);
                                break;
                            }
                        }
                    }
                }
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
    for(var i=0; i<targetChilds.length; i++){
        if(!targetChilds[i].dataset.qclean){
            qclean.framework._hideElementByTargetChild(targetChilds[i], featureDesc);
        }
    }
};

qclean.framework._setupCollaspeComponent = function(component, handler) {
    var header = component.header;
    var container = component.container;
    var title = component.title;

    if (!header.dataset.qcleanCollaspe) {
        console.log("add new collaspe area");
        header.classList.add("qcleanClickable");
        container.classList.add("qcleanHide");
        if (title) {
            title.innerHTML = title.innerHTML + " ...";
        }
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
            //TODO: i13n
        }
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

    // hide sponsored story on newsfeed
    qclean.framework.hideElementsByTargetChildSelector(".uiStreamAdditionalLogging:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

    // hide sponsored ADs
    qclean.framework.hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", qclean.feature.hideSponsoredADs);

    // try to learn
    qclean.framework.hideElementsByTargetChildSelector("div[data-testid=fbfeed_story]:not([data-qclean])", qclean.feature.machineLearningLinksOnNewsFeed);

    // collaspe sidebar content
    qclean.framework.collaspeElementsBySelector(".ego_section:not([data-qclean]):not([style])", qclean.feature.collaspeSidebarContent); 

    // hide recommended game in chat bar
    qclean.framework.hideElementsByTargetChildSelector("#pagelet_canvas_nav_content:not([data-qclean])", qclean.feature.hideRecommendedGameInChatBar);
});

qcleanObserver.observe(document, {
    subtree: true,
    childList: true
});
