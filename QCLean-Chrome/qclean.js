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
    "qclean-only-ads": false,
}, function(items){
    qclean.setting.isRemoveAds = items["qclean-remove-ads"];
    qclean.setting.isRemoveSponsoredPosts = items["qclean-remove-recommended-posts"];
    qclean.setting.isCollaspeRightPanelContent = items["qclean-collaspe-right-panel"];
    qclean.setting.isRemoveGames = items["qclean-remove-games"];
    qclean.setting.isAutoReport = items["qclean-auto-report"];
    qclean.setting.isDebug = items["qclean-debug-mode"];
    qclean.setting.isOnlyAds = items["qclean-only-ads"];
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
    if(element.classList.contains("ego_section")){
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

    // TODO
    let seeAllLink = element.querySelector('.egoGYSJSeeAllLink') || element.querySelector('div+a[href*="category=top"]');
    if (seeAllLink && container) {
        return {
            'seeAllLink': seeAllLink,
            'container' : container
        }
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

// Feature: hide popular accross facebook
qclean.feature.hidePopularAccrossFacebook = {
    "type"          : "hide",
    "judgeFunction" : qclean.hiding.isSponsoredStoryOnNewsFeed,
    "name"          : "hidePopularAccrossFacebook",
    "description"   : "Hide popular accross facebook on news feed"
};

// Feature: hide all nornal post on news feed
qclean.feature.hideNormalStoryOnNewsFeed = {
    "type"          : "hide",
    "judgeFunction" : qclean.hiding.isSponsoredStoryOnNewsFeed,
    "name"          : "hideNormalStoryOnNewsFeed",
    "description"   : "foo"
}

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
    let rule = (featureDesc.rule) ? featureDesc.rule : 'undefined';
    let multiLayerSpan = false;
    if ([
        '2019-02-13--h5', '2019-02-13--h6', 
        '2019-02-17--h5', '2019-02-17--h6',
        '2019-03-07--h5', '2019-03-07--h6',
        '2019-03-08--h5', '2019-03-08--h6',
        ].indexOf(rule) >= 0) {
        multiLayerSpan = true;
    }
    if(!target.dataset.qclean){
        while(element!=null&&element!=undefined){
            // 2018.08.30 speical condition for hidden <a> inside non-sponsored post
            if (featureDesc.type == "hide") {
                let nodeName = element.nodeName;
                if (nodeName === "A" || nodeName === "S") {
                    let style = window.getComputedStyle(element);
                    if (style.display === 'none') {
                        target.dataset.qclean = "done-hidden-"+rule;
                        break;
                    }
                }
            }
            if(featureDesc.judgeFunction(element)){
                if(featureDesc.type == "hide") {
                    if (multiLayerSpan) {   // 2018.02.13 sponsored text and timestamp in same format
                        let timeOrSponsoredText = target.innerText;
                        let containNumber = /\d/.test(timeOrSponsoredText); // number test
                        if (containNumber) {
                            target.dataset.qclean = "done-ignore-"+rule;
                            break;
                        }
                        if (timeOrSponsoredText.split(' ').length > 1) {
                            target.dataset.qclean = "done-ignore-"+rule;
                            break;
                        }
                        //console.log(target.innerText);
                    }
                    target.dataset.qclean = "done-"+rule;
                    if(qclean.setting.isDebug) {
                        element.style.border = "2px solid red";
                    } else {
                        if (featureDesc.name == 'hideSponsoredStoryOnNewsFeed' && qclean.setting.isOnlyAds) {
                            if (element.style.display == 'none') {
                                element.style.display = '';
                            }
                        } else if (featureDesc.name == 'hideNormalStoryOnNewsFeed') {
                            element.style.display = "none";
                        } else {
                            element.style.display = "none";
                        }
                    }
                    if(featureDesc.name == 'hideSponsoredStoryOnNewsFeed' && qclean.setting.isOnlyAds) {
                        element.dataset.qclean = "ads";
                        //console.log(element);
                    } 
                    console.log("Hide something ("+featureDesc.name+")");
                    if (rule && rule != 'undefined') {
                        qclean.i13n.logEvent({
                            event   : "HideByRule",
                            "rule"  : rule
                        });
                    }
                    //if (featureDesc.name === "hidePopularAccrossFacebook") {
                    //}
                    if (featureDesc.name === "hideSponsoredStoryOnNewsFeed") {
                        var pageId = '';
                        var titleLink = element.querySelector('h6 [data-hovercard]');
                        if (!titleLink) {
                            titleLink = element.querySelector('h5 [data-hovercard]');
                        } 
                        if (titleLink && titleLink.dataset['hovercard']) {
                            //console.log(titleLink.dataset['hovercard']); // id=${id}&
                            var link = titleLink.dataset['hovercard'];
                            if (link.indexOf('id=') >= 0) {
                                link = link.split('id=')[1];
                                link = link.split('&')[0];
                                pageId = link;
                            }
                        }
                        /*
                        if (pageId.length > 0) { 
                            console.log(`Page: https://www.facebook.com/${pageId}`);
                        }else {
                            console.log('can not find title link');
                        }
                        */
                        var postId = '';
                        var inputWithPostId = element.querySelector('input[name*=identifier]');
                        if (inputWithPostId && inputWithPostId.value) {
                            postId = inputWithPostId.value;
                        }

                        /*
                        if (postId.length > 0) {
                            console.log(`Post: https://www.facebook.com/${postId}`);
                        } else {
                            console.log('can not find post id');
                        }
                        */

                        var fetchLink = function(link) {
                            var result = '';
                            var ctal = link;
                            if (ctal.indexOf('l.php?') >= 0) {
                                ctal = ctal.split('l.php?')[1];
                                if (ctal.indexOf('u=') >= 0) {
                                    ctal = ctal.split('u=')[1];
                                    ctal = ctal.split('&')[0];
                                    result = decodeURIComponent(ctal);
                                }
                            }
                            return result
                        };

                        var targetLink = '';
                        var callToActionBtn = element.querySelector('[data-lynx-mode][rel][role*=button]');
                        if (callToActionBtn && callToActionBtn.href) {
                            targetLink = fetchLink(callToActionBtn.href);
                        }

                        if (targetLink.length == 0) {
                            var links = element.querySelectorAll('[data-lynx-mode][rel]');
                            for (var al of links) {
                                if (al.classList.length > 0) {
                                    targetLink = fetchLink(al.href);
                                    if (targetLink.length > 0) {
                                        break;
                                    }
                                }
                            }
                        }

                        /*
                        if (targetLink.length > 0) {
                            console.log(`Link to ${targetLink}`);
                        } else {
                            console.log('can not find any links.');
                        }
                        */
                        //console.log(element.innerHTML);
                        if (pageId.length * postId.length > 0) {
                            var e = {
                                event: "SponsoredPost",
                                page: pageId,
                                post: postId
                            };
                            if (targetLink.length > 0) {
                                e['link'] = targetLink;
                            }
                            qclean.i13n.logEvent(e);
                        }
                    }
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
        /*
        qclean.i13n.logEvent({
            event   : "CannotHideTargetElement",
            type    : featureDesc.name
        });
        */
        // here may cause too many log event, so just mark it as done.
        target.dataset.qclean = "done";
    }
};

qclean.framework.hideElementsByTargetChildSelector = function(selectors, featureDesc){
    var targetChilds = document.querySelectorAll(selectors);
    //if (featureDesc.type == 'hide' && targetChilds.length > 0) {
    //    console.log('check '+targetChilds.length);
    //}
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

    if (header && !header.dataset.qcleanCollaspe) {
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
            qclean.i13n.logEvent({
                event: "CollaspeDidTapped"
            });
        }
    } else if (component.seeAllLink && !container.classList.contains('qcleanHide')) {
        console.log("hide new pannel area");
        container.classList.add('qcleanHide');
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
            let hideSponsoredStoryOnNewsFeedFeature = qclean.feature.hideSponsoredStoryOnNewsFeed;
            hideSponsoredStoryOnNewsFeedFeature.rule = '1';
            qclean.framework.hideElementsByTargetChildSelector(".uiStreamAdditionalLogging:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // 2018.04.27 update
            // <h5> or <h6>
            // <div>
            //     <span>
            //         <a href="#"
            //            <div>
            //               <div>
            //               <div>
            //               ...
            //            </div>
            //     </span>
            // </div>
            hideSponsoredStoryOnNewsFeedFeature.rule = '5B';
            qclean.framework.hideElementsByTargetChildSelector("h6+div>span>a[href^='#']>div:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);
            qclean.framework.hideElementsByTargetChildSelector("h5+div>span>a[href^='#']>div:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

            // 2018.06.18 update - Popular Accross facebook
            // <div data-story_category=2
            //     <div>
            //         <div>
            //             <div data-ft=
            //                 <div>
            //                     <div>
            //                         <div></div>
            //                         <div>Popular Accross Facebook</div>
            //
            // "div[data-story_category='2'] > div > div > div[data-ft] > div:first-child > div:first-child > div:empty"
            // category 2
            // categiry 4 may be "People You Man Know" / "Friend Request" / "Top Posts in Your Group"
            hideSponsoredStoryOnNewsFeedFeature.rule = '5A';
            qclean.framework.hideElementsByTargetChildSelector("div[data-story_category]>div>div>div[data-ft]>div:first-child>div:first-child>div:empty:not([data-qclean])", qclean.feature.hidePopularAccrossFacebook);

            // 2019.03.08 update
            // <h5> or <h6>
            // <div>
            //     <span>
            //         <span>
            //             <span>
            //                  <a>
            //                      <span>
            //                         ....
            hideSponsoredStoryOnNewsFeedFeature.rule = '2019-03-08--h6';
            qclean.framework.hideElementsByTargetChildSelector("h6+div>span span>a>span:not([data-qclean])", hideSponsoredStoryOnNewsFeedFeature);
            hideSponsoredStoryOnNewsFeedFeature.rule = '2019-03-08--h5';
            qclean.framework.hideElementsByTargetChildSelector("h5+div>span span>a>span:not([data-qclean])", hideSponsoredStoryOnNewsFeedFeature);

            // 2019.05.16 update // Sponsored paid for by ...
            // <h5>
            // <div>
            //     <a>
            //         <span>
            //             <span>
            //             Paid for by
            //             <spa>
            hideSponsoredStoryOnNewsFeedFeature.rule = '2019-05-16--h5--paid-for-by';
            qclean.framework.hideElementsByTargetChildSelector("h5+div>a>span>span+span:not([data-qclean])", hideSponsoredStoryOnNewsFeedFeature);
        }

        // hide sponsored ADs
        if (qclean.setting.isRemoveAds && !qclean.setting.isOnlyAds) {
            qclean.framework.hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", qclean.feature.hideSponsoredADs);

            // create ad's button's link: /campaign/landing.php?placement=emuca&campaign_id=282141474901&extra_1=auto
            qclean.framework.hideElementsByTargetChildSelector("a[href^='/campaign/landing.php']:not([data-qclean])", qclean.feature.hideSponsoredADs);

            // create ad's button's link: /ad_campaign/landing.php?placement=emuca&campaign_id=282141474901&extra_1=auto
            qclean.framework.hideElementsByTargetChildSelector("a[href^='/ad_campaign/landing.php']:not([data-qclean])", qclean.feature.hideSponsoredADs);

            qclean.framework.hideElementsByTargetChildSelector("a[href^='https://l.facebook.com/l.php?u=']:not([data-qclean])", qclean.feature.hideSponsoredADs);
        }

        // try to learn
        if (qclean.setting.isAutoReport) {
            // FIXME
            //qclean.framework.hideElementsByTargetChildSelector("div[data-testid=fbfeed_story]:not([data-qclean])", qclean.feature.machineLearningLinksOnNewsFeed);
        }

        // collaspe sidebar content
        if (qclean.setting.isCollaspeRightPanelContent) {
            // FIXME
            qclean.framework.collaspeElementsBySelector(".ego_section:not([data-qclean]):not([style])", qclean.feature.collaspeSidebarContent); 
        }

        // hide recommended game in chat bar
        if (qclean.setting.isRemoveGames && !qclean.setting.isOnlyAds) {
            qclean.framework.hideElementsByTargetChildSelector("#pagelet_canvas_nav_content:not([data-qclean])", qclean.feature.hideRecommendedGameInChatBar);
        }

        // only show ads 
        if (qclean.setting.isOnlyAds) {
            qclean.framework.hideElementsByTargetChildSelector("[data-testid=fbfeed_story]:not([data-qclean='ads'])", qclean.feature.hideNormalStoryOnNewsFeed);
        }
    }
});

qcleanObserver.observe(document, {
    subtree: true,
    childList: true
});
