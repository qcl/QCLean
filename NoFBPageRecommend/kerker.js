console.log('Load kerker.js');

var removeADsLink = function(){

    var rfbspADsLink = document.getElementsByClassName("adsCategoryTitleLink");

    for(var i=0;i<rfbspADsLink.length;i++){
        //XXX
        rfbspADsLink[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        console.log('Remove ads');
    }

}

var removeSuggestedPage = function(){

    var fbsp = document.getElementsByClassName("uiLikePage");
    for(var i=0;i<fbsp.length;i++){
        var sp = fbsp[i];
        var found = true;
        while(sp.parentNode.nodeName!="LI"){
            if(sp.parentNode.nodeName=="BODY"){
                break;
                found = false;
            }
            sp = sp.parentNode;
        }
        if(found){
            sp = sp.parentNode;
            sp.remove();
            console.log('Remove suggested page/post');
        }
    }
}

var removeLikePage = function(){

    var fk = document.getElementsByClassName("uiLikePageButton");
    if(fk.length>0){
        for(var i=0;i<fk.length;i++){
            var n = fk[i];
            var count = 0;
            var found = false;
            while(n.parentNode.nodeName!="BODY"){
                if(n.parentNode.nodeName=="LI"){
                    count++;
                    if(count>=2){
                        found = true;
                        break;
                    }
                }
                n = n.parentNode;
            }
            if(found){
                n = n.parentNode;
                n.parentNode.removeChild(n);
                console.log('Remove suggested page/post');
            }
        }
    }
}

var removeSponsored = function(){

    var sp = document.getElementsByClassName("uiStreamAdditionalLogging");    
    for(var i = 0;i<sp.length;i++){
        var n = sp[i];
        while(n.parentNode.nodeName!="BODY"){
            if(n.parentNode.nodeName=="LI"){
                if(n.parentNode.hasAttribute("class")&&n.parentNode.getAttribute("class").match("uiStreamStory")){
                    found = true;
                    break;
                }
            }
            n = n.parentNode;
        }
        if(found){
            n = n.parentNode;
            n.remove();
            console.log('Remove sponsored post');
        }
    }
}

//removeLikePage();
//removeSuggestedPage();
removeSponsored();
removeADsLink();

//Override appendChild function
var rfbspAppend = HTMLElement.prototype.appendChild;
HTMLElement.prototype.appendChild = function(){
    rfbspAppend.apply(this,arguments);
    //removeLikePage();
    //removeSuggestedPage();
    removeSponsored();
    removeADsLink();
}


//Override xhr
var rfbspXHR = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(){
    if(arguments.length>2&&arguments[1].match("/ajax/pagelet/generic.php/WebEgoPane")){
        console.log('Block ads ajax request'); 
    }else{
        rfbspXHR.apply(this,arguments);
        //var xhr = this;
        //var xhrfnt = xhr.onreadystatechange;
        //xhr.onreadystatechange = function(){
        //    xhrfnt.apply(this,arguments);
        //    removeSponsored();
        //    removeADsLink();
        //}
    }
}


