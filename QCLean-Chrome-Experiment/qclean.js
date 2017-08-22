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
    "qclean-hide-pokemon-go": false,
}, function(items){
    qclean.setting.isRemoveAds = items["qclean-remove-ads"];
    qclean.setting.isRemoveSponsoredPosts = items["qclean-remove-recommended-posts"];
    qclean.setting.isCollaspeRightPanelContent = items["qclean-collaspe-right-panel"];
    qclean.setting.isRemoveGames = items["qclean-remove-games"];
    qclean.setting.isAutoReport = items["qclean-auto-report"];
    qclean.setting.isHidePokemonGo = items["qclean-hide-pokemon-go"];
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

// Feature: hide pokemon go related posts
qclean.feature.hidePokemonGoOnNewsFeed = {
    "type"          : "pokemon",
    "judgeFunction" : qclean.hiding.isSponsoredStoryOnNewsFeed,
    "name"          : "hidePokemonGoOnNewsFeed",
    "description"   : "Hide pokemon go related posts"
};

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
    if (!target.dataset.qcleanpokemon) {
        if (featureDesc.judgeFunction(element)) {
            if (featureDesc.type == "pokemon") {
                var links = element.querySelectorAll("a");
                if (links.length == 0) {
                    // facebook not load info yet.
                    return;
                }
                var sponsored = element.querySelector(".uiStreamAdditionalLogging");
                if (sponsored) {
                    // it's a sponsored posts
                    return;
                }
                //console.log(element);
                target.dataset.qcleanpokemon = "done";
                var reason = "";
                var userContents = element.querySelectorAll(".userContent");
                var userContentWrappers = element.querySelectorAll(".userContentWrapper");
                var mtm = element.querySelectorAll(".mtm");
                var mayBePokemonPost = false;
                var pokemonKeywords = ['寶可夢', '神奇寶貝', 'pokemon', 'pokémon', '可達鴨', '鯉魚王', '抓怪', 'pokego', '御三家', '寶貝球' , '補給點', '驛站', '點香', '灑花點', '灑櫻花', '伊布', '進化', '道館', '黃隊', '紅隊', '藍隊', '訓練師', '皮卡丘', '小火龍', '妙蛙種子', '傑尼龜', 'pokestop', '皮卡超', '抓寶', '孵蛋','ㄆㄎㄇ'];
                var forms = element.querySelectorAll("form");
                var searchPokemonKeywords = function(dom) {
                    for (var j = 0; j < pokemonKeywords.length; j++) {
                        if (dom.innerHTML.toLowerCase().indexOf(pokemonKeywords[j]) >= 0) {
                            return true;
                        } 
                    }
                    return false;
                };

                for (var i = 0; i < userContents.length; i++) {
                    var userContent = userContents[i];
                    mayBePokemonPost = searchPokemonKeywords(userContent);
                    if (mayBePokemonPost) {
                        reason = "keyword";
                        break;
                    }
                }
                if (!mayBePokemonPost) {
                    for (var i = 0; i < mtm.length; i++) {
                        mayBePokemonPost = searchPokemonKeywords(mtm[i]);
                        if (mayBePokemonPost) {
                            reason = "linkKeyword"
                            break;
                        }
                    }
                }
               
                var imgs = element.querySelectorAll(".mtm a img");
                var totalCount = imgs.length;
                var mayBeCount = 0;
                //console.log(element);
                //console.log(imgs);
                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i];
                    var width = undefined;
                    var hegith = undefined;
                    if (img.width) {
                        width = img.width;
                    }
                    if (img.height) {
                        height = img.height;
                    }
                    if (!width && img.attributes && img.attributes.width && img.attributes.width.value) {
                        width = parseInt(img.attributes.width.value);
                    }
                    if (!height && img.attributes && img.attributes.height && img.attributes.height.value) {
                        height = parseInt(img.attributes.height.value);
                    }
                    if (width && height) {
                        if (width / height < 0.6) {
                            // which means it may be a cell phont screen shot. :p
                            // need more img for Deep Leanring to recongize the img.
                            mayBeCount++;
                            qclean.i13n.logEvent({
                                event   : "PokemonPost",
                                type    : "screenshot",
                                content : img.src
                            });
                        }
                    }
                    if (mayBePokemonPost) {
                        qclean.i13n.logEvent({
                            event   : "PokemonPost",
                            type    : "screenshot-sure",
                            content : img.src
                        });
                    }
                }
                if (!mayBePokemonPost) {
                    if (totalCount > 0 && mayBeCount / totalCount > 0.45) {
                        // just a magic number
                        mayBePokemonPost = true;
                        reason = "screenshot";
                    }
                }
                
                if (mayBePokemonPost) {
                    qclean.i13n.logEvent({
                        event   : "PokemonPost",
                        type    : "hide"
                    });
                    //for (var i = 0; i < userContentWrappers.length; i++) {
                    //    userContentWrappers[i].style.background = "oldlace";
                    //}
                    for (var i = 0; i < userContents.length; i++) {
                        userContents[i].classList.add('qcleanHide');
                    }
                    for (var i = 0; i < mtm.length; i++) {
                        mtm[i].classList.add('qcleanHide');
                    }
                    for (var i = 0; i < forms.length; i++) {
                        forms[i].classList.add('qcleanHide');
                    }
                    if (target.firstChild) {
                        var reasonText = "關鍵字";
                        if (reason == "linkKeyword") {
                            reasonText = "關鍵字";
                        } else if (reason == "screenshot") {
                            reasonText = "螢幕截圖";
                        }
                        var clickToOpenDiv = document.createElement("div");
                        clickToOpenDiv.classList.add("qcleanTextCenter", "qcleanClickable");
                        clickToOpenDiv.innerHTML = "<p>疑似 Pokemon Go 貼文（"+reasonText+"），點我可展開貼文。</p>";
                        target.firstChild.insertBefore(clickToOpenDiv, target.firstChild.firstChild);
                        clickToOpenDiv.onclick = function(event) {
                            event.preventDefault();
                            console.log("click to open!");
                            if (this.parentElement) {
                                var hidedDoms = this.parentElement.querySelectorAll(".qcleanHide");
                                for (var i = 0; i < hidedDoms.length; i++) {
                                    hidedDoms[i].classList.remove("qcleanHide");
                                }
                                this.parentElement.removeChild(this);
                            } else {
                                this.classList.add("qcleanHide");
                            }
                            qclean.i13n.logEvent({
                                event   : "PokemonPost",
                                type    : "open"
                            });
                        };
                    }
                }
            }
        }
    }
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
                        // skip sponsored post
                        var sponsored = element.querySelector(".uiStreamAdditionalLogging");
                        if (sponsored) {
                            //console.log("sponsored!");
                            //console.log(sponsored);
                            break;
                        }
                        // TODO not every thing in life is likeable
                        var like = element.querySelector("a.UFILikeLink");
                        var share = element.querySelector("a.share_action_link");
                        //console.log(like);
                        //console.log(share);
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
                                qclean.i13n.logEvent({
                                    event   :"LearningFromPost",
                                    type    :"link",
                                    content :fetchedLink
                                });
                                //console.log(fetchedLink);
                                // TODO not every thing in life is likeable
                                // set like event
                                if (like && !like.dataset.qcleanOnclick) {
                                    like.dataset.qcleanOnclick = "true";
                                    like.dataset.qcleanLink = fetchedLink;
                                    like.addEventListener("click", function() {
                                        if (this.dataset.qcleanOnclick && this.dataset.qcleanLink && qclean) {
                                            var fetchedLink = this.dataset.qcleanLink;
                                            console.log("like " + fetchedLink + " clicked!!!");
                                            qclean.i13n.logEvent({
                                                event   :"LearningFromPost",
                                                type    :"link-like",
                                                content :fetchedLink
                                            });
                                        }
                                    });
                                }
                                // set share event
                                if (share && !share.dataset.qcleanOnclick) {
                                    share.dataset.qcleanOnclick = "true";
                                    share.dataset.qcleanLink = fetchedLink;
                                    share.addEventListener("click", function() {
                                        if (this.dataset.qcleanOnclick && this.dataset.qcleanLink && qclean) {
                                            var fetchedLink = this.dataset.qcleanLink;
                                            console.log("share " + fetchedLink + " clicked!!!");
                                            qclean.i13n.logEvent({
                                                event   :"LearningFromPost",
                                                type    :"link-share",
                                                content :fetchedLink
                                            });
                                        }
                                    });
                                }
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
    if(!target.dataset.qclean && featureDesc.type == "hide"){
        //here means qclean didn't hide our target element.
        qclean.i13n.logEvent({
            event   : "CannotHideTargetElement",
            type    : featureDesc.name
        });
    }
};

qclean.framework.hideElementsByTargetChildSelector = function(selectors, featureDesc){
    var targetChilds = document.querySelectorAll(selectors);
    //if (featureDesc.type == "pokemon") {
    //    console.log(targetChilds.length);
    //}
    for(var i=0; i<targetChilds.length; i++){
        if(!targetChilds[i].dataset.qclean){
            qclean.framework._hideElementByTargetChild(targetChilds[i], featureDesc);
        } else if (!targetChilds[i].dataset.qcleanpokemon) {
            //console.log("Poke");
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
            qclean.i13n.logEvent({
                event: "CollaspeDidTapped"
            });
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
            qclean.framework.hideElementsByTargetChildSelector("div>span>a[href^='https://l.facebook.com/l.php?']:not([data-qclean])", qclean.feature.hideSponsoredStoryOnNewsFeed);

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
        }

        // hide sponsored ADs
        if (qclean.setting.isRemoveAds) {
            qclean.framework.hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", qclean.feature.hideSponsoredADs);
        }

        // try to learn
        if (qclean.setting.isAutoReport) {
            qclean.framework.hideElementsByTargetChildSelector("div[data-testid=fbfeed_story]:not([data-qclean])", qclean.feature.machineLearningLinksOnNewsFeed);
        }

        // try to hide pokemon go posts
        if (qclean.setting.isHidePokemonGo) {
            qclean.framework.hideElementsByTargetChildSelector("div[data-testid=fbfeed_story]:not([data-qcleanpokemon])", qclean.feature.hidePokemonGoOnNewsFeed);
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
