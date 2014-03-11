console.log("Load qclean.js");
var qclean = qclean || {};

if(qclean.settingReport){
var _gaq = _gaq || [];
_gaq.push(['_setAccount','UA-3607701-4']);
_gaq.push(['_trackEvent','ReportCrash','on']);
(function(){
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://stats.g.doubleclick.net/dc.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
}


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
                _gaq.push(['_trackEvent','CrashReport','RemoveAD']);
            }
            break;
        }
    }
};

qclean.storyClassNames = [
    "_6ns _8ru _59hp",
    "_5jmm _5pat _5srp",
    "_5jmm _5pat _5uch",
    "_5uch _5jmm _5pat"
    ];

qclean.removeSponsored = function(){

    if(!qclean.settingRmrp){
        return;
    }

    var sp = document.getElementsByClassName("uiStreamAdditionalLogging");
    var combo = 0;
    while(sp.length>0){
        for(var i = 0;i<sp.length;i++){
            var n = sp[i];
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
                        }
                    }
                }
                n = n.parentNode;
            }
            if(found){
                n = n.parentNode;
                n.parentNode.removeChild(n);
                console.log('Remove sponsored post');
            }
        }
        sp = document.getElementsByClassName("uiStreamAdditionalLogging");
        combo++;
        if(combo>3){
            //TODO - notify there is some thing new/unknow
            console.log("Found but can not remove Q____Q");
            if(qclean.settingReport){
                _gaq.push(['_trackEvent','CrashReport','RemoveSponsored']);
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

qclean.lineRegExp = new RegExp("(加ID：|加賴|請加LINE|請加我的LINE|麻煩加我LINE|加一下LINE|訂購加LINE|請加 LINE|請加我LINE)+","i");
qclean.hideInfo = "<div style='cursor:pointer;'><img src='"+qclean.logoSrc+"'/><p>QCLean：疑似購物貼文，點擊觀看或隱藏原文。（或至QCLean Settings關閉此功能）</p></div>";
qclean.hideLineTagging = function(){
    
    if(!qclean.settingHs){
        return;
    }

    var targets = document.getElementsByClassName("mvm");
    //console.log("QCLean-Testing, #of targets: "+targets.length);
    
    for(var i=0;i<targets.length;i++){
        if(!targets[i].hasAttribute("qclean-looked")){
            targets[i].setAttribute("qclean-looked","true");
            if(targets[i].hasAttribute("data-ft")){
                var string = targets[i].innerHTML;
                if(qclean.lineRegExp.test(string)){
                    if(qclean.settingReport){
                        _gaq.push(['_trackEvent','LineTagging','originString',string]);
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
                                    _gaq.push(['_trackEvent','LineTagging','TaggerName',bad.innerHTML]);
                                    _gaq.push(['_trackEvent','LineTagging','TaggerURL',bad.href]);
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
        qclean.hideLineTagging();
    
        //For new fb newsfeed
        qclean.removeSponsored();
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

