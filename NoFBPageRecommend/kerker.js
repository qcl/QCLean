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

removeLikePage();
removeSuggestedPage();
removeADsLink();

//Override appendChild function
var rfbspULappend = HTMLUListElement.prototype.appendChild;
HTMLUListElement.prototype.appendChild = function(){
    rfbspULappend.apply(this,arguments);
    removeLikePage();
    removeSuggestedPage();
}

var rfbspDIVappend = HTMLDivElement.prototype.appendChild;
HTMLDivElement.prototype.appendChild = function(){
    rfbspDIVappend.apply(this,arguments);
    removeADsLink();
}

