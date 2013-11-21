var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3607701-4']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var removeADsLink = function(){

    var rfbspADsLink = document.getElementsByClassName("adsCategoryTitleLink");

    while(rfbspADsLink.length>0){
        for(var i=0;i<rfbspADsLink.length;i++){
            var target = rfbspADsLink[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            target.parentNode.removeChild(target);
            console.log('Remove ads');
        }
        rfbspADsLink = document.getElementsByClassName("adsCategoryTitleLink");
    }
};

var removeSponsored = function(){

    var sp = document.getElementsByClassName("uiStreamAdditionalLogging");
    var combo = 0;
    while(sp.length>0){
        for(var i = 0;i<sp.length;i++){
            var n = sp[i];
            var found = false;
            while(n.parentNode.nodeName!="BODY"){
                if(n.parentNode.nodeName=="LI"){
                    if(n.parentNode.hasAttribute("class")&&n.parentNode.getAttribute("class").match("uiStreamStory")){
                        found = true;
                        break;
                    }
                }else if(n.parentNode.nodeName=="DIV"){
                    if(n.parentNode.hasAttribute("class")){
                        if(n.parentNode.getAttribute("class").match("_6ns _8ru _59hp")){
                            //for new fb newsfeed
                            found = true;
                            break;
                        }else if(n.parentNode.getAttribute("class").match("_5jmm _5pat _5srp")){                    
                            //fb change its class name, jizz
                            found = true;
                            break;
                        }
                    }
                }
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
            break;
        }
    }
}

removeSponsored();
removeADsLink();


//Override xhr
var rfbspXHR = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(){
    if(arguments.length>2&&typeof arguments[1] == "string"&&arguments[1].match("/ajax/pagelet/generic.php/WebEgoPane")){
        console.log('Block ads ajax request'); 
    }else{
        rfbspXHR.apply(this,arguments);
    }
}

//Override DIV appendChild
var rmfbspDivAppend = HTMLDivElement.prototype.appendChild;
HTMLDivElement.prototype.appendChild = function(){ 
    rmfbspDivAppend.apply(this,arguments); 
    removeADsLink();
    removeSponsored();
}

//Override UL appendChild
var rmfbspUlAppend = HTMLUListElement.prototype.appendChild;
HTMLUListElement.prototype.appendChild = function(){ 
    rmfbspUlAppend.apply(this,arguments); 
    removeSponsored();
}
