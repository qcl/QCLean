var qclean = qclean || {};
qclean.version = "0.4.5.7";
console.log("Load qclean.js" + " version:"+qclean.version);

if(qclean.settingReport){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create','UA-3607701-10','auto');
    ga('send','event','SettingReportCrash','on');
}

//Try to remove game you may like
qclean.removeGameYouMayLike = function(){
   
    //FIXME
    return;

    if(!qclean.settingRmg){
        return;
    }

    var gameLinks = document.querySelectorAll("a[href='https://www.facebook.com/games/']");
    var combo = 0;
    while(gameLinks.length>0){
        //try to remove it
        for(var i = 0; i < gameLinks.length; i++){
            var n = gameLinks[i];
            var found = false;

            while(n != null && n != undefined){
                if(n.nodeName == "LI"){
                    if(n.classList.contains("uiStreamStory")){
                        found = true;
                        break;
                    }
                }else if(n.nodeName == "DIV"){
                    if(n.dataset.ft && JSON.parse(n.dataset.ft).mf_story_key){
                        found = true;
                        break;
                    } 
                }
                n = n.parentElement;
            }
            if(found){
                n.parentElement.removeChild(n);
                console.log("Remove game you may like");
                if(qclean.settingReport){
                    //TODO - track game name
                    ga('send','event','RemoveReport','RemoveGameSuccess-'+qclean.version);
                }
            }
        }
        gameLinks = document.querySelectorAll("a[href='https://www.facebook.com/games/']");
        combo++;
        if(combo>3){
            console.log("Found game recommendation but cannot remove it");
            if(qclean.settingReport){
                ga('send', 'event', 'CrashReport', 'RemoveGame-'+qclean.version);
            }
            break;
        }
    }

};

qclean.removeADsLink = function(){

    if(!qclean.settingRmad){
        return;
    }

    var adsLink = document.getElementsByClassName("adsCategoryTitleLink");
    var combo = 0;
    while(adsLink.length>0){
        for(var i=0;i<adsLink.length;i++){
            var target = adsLink[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            target.parentNode.removeChild(target);
            console.log('Remove ads');
        }
        adsLink = document.getElementsByClassName("adsCategoryTitleLink");
        combo++;
        if(combo>3){
            //TODO - report more useful information for fix bugs.
            console.log("Found but can not remove Q____Q");
            if(qclean.settingReport){
                ga('send','event','CrashReport','RemoveAD');
            }
            break;
        }
    }
};

if(qclean.storyClassNames==undefined){
    qclean.storyClassNames = [
        "_6ns _8ru _59hp",
        "_6ns _5jmm _5jmm",
        "_5jmm _5pat _5srp",
        "_5jmm _5pat _5uch",
        "_5uch _5jmm _5pat",
        "_4-u2 mbm _5jmm _5pat _5v3q _5sq8 _5x16"
        ];
}

qclean.removeSponsored = function(){

    if(!qclean.settingRmrp){
        return;
    }

    var sp = document.getElementsByClassName("uiStreamAdditionalLogging");
    var combo = 0;
    while(sp.length>0){
        var classNameCollections = [];
        for(var i = 0;i<sp.length;i++){
            var n = sp[i];
            var found = false;
            var classNameCollection = [];
            
            while(n != null && n != undefined){
                if(n.nodeName == "LI"){
                    if(n.classList.contains("uiStreamStory")){
                        found = true;
                        break;
                    }
                }else if(n.nodeName == "DIV"){
                    if(n.dataset.ft && JSON.parse(n.dataset.ft).mf_story_key){
                        found = true;
                        if(qclean.settingReport){
                            ga('send','event','CrashReport','ClassNameFound-'+qclean.version,JSON.stringify(n.className));
                        }
                        break;
                    }
                } 
                classNameCollection.push(n.className);
                n = n.parentElement;
            }
            if(found){
                n.parentElement.removeChild(n);
                console.log('Remove sponsored post');
            }else{
                classNameCollections.push(classNameCollection);
            }
        }
        sp = document.getElementsByClassName("uiStreamAdditionalLogging");
        combo++;
        if(combo>3){
            //TODO - notify there is some thing new/unknow
            console.log("Found but can not remove Q____Q");
            if(qclean.settingReport){
                ga('send','event','CrashReport','RemoveSponsored-'+qclean.version,JSON.stringify(classNameCollections));
            }
            break;
        }
    }
};

qclean.hideSection = function(){
    
    if(!qclean.settingHr){
        return;
    }

    var sections = document.getElementsByClassName("ego_section");
    for(var i=0;i<sections.length;i++){
        var section = sections[i];
        var header  = section.getElementsByClassName("uiHeaderTitle");
        var container = section.getElementsByClassName("ego_unit_container");
        if(header.length*container.length>0){
            header = header[0];
            container = container[0];
            if(!header.hasAttribute("qclean-hide")){
                header.setAttribute("qclean-hide","true");
                header.classList.add("qcleanClickable");
                header.innerHTML = header.innerHTML + " ("+container.childNodes.length+")";
                container.classList.add("qcleanHide");
                header.qcleanContainer = container;
                header.onclick = function(){
                    if(this.getAttribute("qclean-hide")=="true"){
                        this.qcleanContainer.classList.remove("qcleanHide");
                        this.setAttribute("qclean-hide","false");
                    }else{
                        this.qcleanContainer.classList.add("qcleanHide");
                        this.setAttribute("qclean-hide","true");
                    }
                };
            }
        }
    }
};

//NOTE: experimental function
qclean.hideGameSection = function(){
    
    if(!qclean.settingHr){
        return;
    }

    var gameSection = document.getElementById("pagelet_games_rhc");
    if(gameSection) {
        var headers = gameSection.getElementsByClassName("uiHeader");
        for (var i = 0; i < headers.length; i++ ) {
            var header = headers[i];
            
            // NOTE: there are 2 types game recommendation sections
            // Type #1: TOP Picks for you
            //      <div header>
            //      <div container>
            //
            // Type #2: Recommended game 
            //      <a>
            //          <div header>
            //      <div container>
            //
            // Here only try to deal with those types.

            var container = undefined;
            if (header.nextSibling) {
                // Type 1
                container = header.nextSibling;
                //console.log("Found type 1 game recommendation");
                //console.log(container);
            } else if (header.parentNode && header.parentNode.nodeName == "A" && header.parentNode.nextSibling) {
                // Type 2
                container = header.parentNode.nextSibling;
                //console.log("Found type 2 game recommendation");
                //console.log(container);
            } 

            if (container && container.nodeName == "DIV") {
                if(!header.hasAttribute("qclean-hide")){
                    console.log("Hide game recommendation section");
                    header.setAttribute("qclean-hide","true");
                    header.classList.add("qcleanClickable");
                    var realHeader = header.getElementsByClassName("uiHeaderTitle");
                    if (realHeader && realHeader.length > 0) {
                        realHeader[0].innerHTML = realHeader[0].innerHTML + "...";
                    }
                    container.classList.add("qcleanHide");
                    header.qcleanContainer = container;
                    header.onclick = function(event){
                        event.preventDefault();
                        if(this.getAttribute("qclean-hide")=="true"){
                            this.qcleanContainer.classList.remove("qcleanHide");
                            this.setAttribute("qclean-hide","false");
                        }else{
                            this.qcleanContainer.classList.add("qcleanHide");
                            this.setAttribute("qclean-hide","true");
                        }
                    };
                }
            }
        }
    }
};

//NOTE; experimental function
qclean.hideGameInSidebar = function(){
    if(!qclean.settingRmad){
        return;
    }
   
    if(document.querySelectorAll){
        var pageletCanvasNavContent = document.querySelectorAll("#pagelet_canvas_nav_content");
        var fbChatSidebarBody = document.querySelectorAll(".fbChatSidebarBody");
        if (pageletCanvasNavContent.length * fbChatSidebarBody.length > 0) {
            pageletCanvasNavContent = pageletCanvasNavContent[0];
            fbChatSidebarBody = fbChatSidebarBody[0];

            var canvH = pageletCanvasNavContent.style.height;
            var chatH = fbChatSidebarBody.style.height;

            if (canvH.indexOf("px") > 0 && chatH.indexOf("px") > 0) {
                var canvHeight = canvH.slice(0,canvH.indexOf("px"));
                var chatHeight = chatH.slice(0,chatH.indexOf("px"));
                
                if (canvHeight != 0) {
                    fbChatSidebarBody.style.height = canvHeight + chatHeight + "px";
                    pageletCanvasNavContent.style.height = "0px";
                }
            } else if (!canvH) {
                pageletCanvasNavContent.style.height = "0px";
            } 
        }
    }
};

if(qclean.lineRegExp==undefined){
    qclean.lineRegExp = new RegExp("(加ID：|加賴|請加LINE|請加我的LINE|麻煩加我LINE|加一下LINE|訂購加LINE|請加 LINE|請加我LINE|訂購要加LINE|加賴LINE ID|請加我賴LINE|加私信賴|加奈)+","i");
}
qclean.hideInfo = "<div style='cursor:pointer;'><img src='"+qclean.logoSrc+"'/><p>QCLean：疑似購物貼文，點擊觀看或隱藏原文。（或至QCLean Settings關閉此功能）</p></div>";
qclean.hideLineTagging = function(){
    
    if(!qclean.settingHs){
        return;
    }

    var targets = document.getElementsByClassName("mvm");
    if(targets.length==0){
        var targets = document.getElementsByClassName("userContentWrapper");
    }
    //console.log("QCLean-Testing, #of targets: "+targets.length);
    
    for(var i=0;i<targets.length;i++){
        if(!targets[i].hasAttribute("qclean-looked")){
            targets[i].setAttribute("qclean-looked","true");
            if(targets[i].hasAttribute("data-ft")){
                var string = targets[i].innerHTML;
                if(qclean.lineRegExp.test(string)){
                    if(qclean.settingReport){
                        ga('send','event','LineTagging','originString',string);
                    }
                    //console.log(targets[i]);
                    var node = targets[i].parentNode.parentNode.parentNode;
                    node.setAttribute("qclean-innerHTML",node.innerHTML);
                    node.setAttribute("qclean-hide","true");
                    node.innerHTML = qclean.hideInfo;
                    node.onclick = function(){
                        if(this.getAttribute("qclean-hide")=="true"){
                            this.setAttribute("qclean-hide","false");
                            this.innerHTML = qclean.hideInfo + this.getAttribute("qclean-innerHTML");
                        }else{
                            this.setAttribute("qclean-hide","true");
                            this.innerHTML = qclean.hideInfo;
                        }
                    };
                    console.log("Hide Spam Information+");
                    //console.log(targets[i].parentNode.parentNode.parentNode);
                    var n = node;
                    var found = false;
                    while(n.parentNode.nodeName!="BODY"){
                        if(n.parentNode.nodeName=="LI"){
                            if(n.parentNode.hasAttribute("class")&&n.parentNode.getAttribute("class").match("uiStreamStory")){
                                //for fb old ui user
                                found = true;
                                break;
                            }
                        }else if(n.parentNode.nodeName=="DIV"){
                            if(n.parentNode.hasAttribute("class")){
                                var className = n.parentNode.getAttribute("class");
                                for(var i = 0; i<qclean.storyClassNames.length; i++){
                                    if(className.match(qclean.storyClassNames[i])){
                                        found = true;
                                        break;
                                    }
                                }
                                if(found){
                                    break;
                                }else{
                                    if(n.parentNode.hasAttribute("data-ft")){
                                        var dataFt = JSON.parse(n.parentNode.getAttribute("data-ft"));
                                        if(dataFt["mf_story_key"]!=undefined){
                                            found = true;
                                            console.log("class "+className+" may be story class name.");
                                            if(qclean.settingReport){
                                                ga('send','event','CrashReport','ClassNameFound-'+qclean.version,JSON.stringify(className));
                                            }
                                            break;
                                        }

                                    }
                                }
                            }
                        }
                        n = n.parentNode;
                    }
                    if(found){
                        n = n.parentNode;
                        if(n.querySelectorAll){
                            var badmen = n.querySelectorAll("a.profileLink");
                            if(badmen.length>=3){
                                var bad = badmen[badmen.length-2];
                                console.log(bad.innerHTML);
                                console.log(bad.href);
                                if(qclean.settingReport){
                                    ga('send','event','LineTagging','TaggerName',bad.innerHTML);
                                    ga('send','event','LineTagging','TaggerURL',bad.href);
                                }
                            }
                        }
                    }
                }
            }
        }else{
            //targets[i].setAttribute("qclean-looked","true");
        }
    }
     
};

qclean.removeSponsored();
qclean.removeADsLink();
qclean.hideSection();
qclean.hideLineTagging();
qclean.removeGameYouMayLike();
qclean.hideGameSection();
qclean.hideGameInSidebar();

//Override xhr
if(XMLHttpRequest.prototype.overrideByQCLean===undefined){

    var originXHRopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        /*
            arguments[0] - method
            arguments[1] - url, but some ajax request is not a string 
                           (facebook graph api?), so need to check this 
                           argument's type.
        */
        if(arguments.length>2&&typeof arguments[1] == "string"
            &&arguments[1].match("/ajax/pagelet/generic.php/WebEgoPane")){
        
            console.log('Block ads ajax request'); 
        }else{
            originXHRopen.apply(this,arguments);
        }
    }
    XMLHttpRequest.prototype.overrideByQCLean = true;

}

//Override DIV appendChild
if(HTMLDivElement.prototype.overrideByQCLean===undefined){

    var originDivAppend = HTMLDivElement.prototype.appendChild;
    HTMLDivElement.prototype.appendChild = function(){ 
        originDivAppend.apply(this,arguments); 
        qclean.removeADsLink();
        qclean.hideSection();
        qclean.hideGameSection();
        qclean.hideGameInSidebar();
        qclean.hideLineTagging();
    
        //For new fb newsfeed
        qclean.removeSponsored();

        qclean.removeGameYouMayLike();
    }
    HTMLDivElement.prototype.overrideByQCLean = true;

}

//Override UL appendChild
if(HTMLUListElement.prototype.overrideByQCLean===undefined){

    var originUlAppend = HTMLUListElement.prototype.appendChild;
    HTMLUListElement.prototype.appendChild = function(){ 
        originUlAppend.apply(this,arguments); 
        qclean.removeSponsored();
    }
    HTMLUListElement.prototype.overrideByQCLean = true;

}

