/*
 *  QCLean - experiment
 */

console.log("Load qclean.js");

var judgeSponserdLinkOnNewsFeed = function(element){
    if(element.dataset.ft && JSON.parse(element.dataset.ft).mf_story_key){
        return true;
    }
    return false;
};

var judgeSponserdLinkOnPhotoView = function(element){
    if(element.className=="ego_section"){
        return true;
    }
    return false;
};

var hideElementByTargetChild = function(target, judgeFunction){
    var element = target;
    if(!target.dataset.qclean){
        while(element!=null&&element!=undefined){
            if(judgeFunction(element)){
                element.style.display = "none";
                target.dataset.qclean = "done";
                console.log("Hide something");
                break;
            }
            element = element.parentElement;
        }
    }
    /*
    if(!target.dataset.qclean){
        //here means qclean didn't hide our target element.
    }
    */
};

var hideElementsByTargetChildSelector = function(selectors, judgeFunction){
    var targetChilds = document.querySelectorAll(selectors);
    //if(targetChilds.length>0){
    //    console.log(targetChilds.length);
    //}
    for(var i=0; i<targetChilds.length; i++){
        if(!targetChilds[i].dataset.qclean){
            hideElementByTargetChild(targetChilds[i], judgeFunction);
        }
    }
};

var qcleanObserver = new window.MutationObserver(function(mutation, observer){
    //console.log("Observer triggered");

    // hide sponsered story on newsfeed
    hideElementsByTargetChildSelector(".uiStreamAdditionalLogging:not([data-qclean])", judgeSponserdLinkOnNewsFeed);

    // hide sponsered link on photo view
    hideElementsByTargetChildSelector(".adsCategoryTitleLink:not([data-qclean])", judgeSponserdLinkOnPhotoView);
});

qcleanObserver.observe(document, {
    subtree: true,
    childList: true
});
