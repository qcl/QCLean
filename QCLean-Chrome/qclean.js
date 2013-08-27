
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
    while(sp.length>0){
        for(var i = 0;i<sp.length;i++){
            var n = sp[i];
            while(n.parentNode.nodeName!="BODY"){
                if(n.parentNode.nodeName=="LI"){
                    if(n.parentNode.hasAttribute("class")&&n.parentNode.getAttribute("class").match("uiStreamStory")){
                        found = true;
                        break;
                    }
                }else if(n.parentNode.nodeName=="DIV"){
                    if(n.parentNode.hasAttribute("class")&&n.parentNode.getAttribute("class").match("_6ns _8ru _59hp")){
                        //for new fb newsfeed
                        found = true;
                        break;
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
    }
}

removeSponsored();
removeADsLink();


//Override xhr
if(XMLHttpRequest.prototype.overrideByQCLean===undefined){

    var rfbspXHR = XMLHttpRequest.prototype.open;
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
            rfbspXHR.apply(this,arguments);
        }
    }
    XMLHttpRequest.prototype.overrideByQCLean = true;
}

//Override DIV appendChild
if(HTMLDivElement.prototype.overrideByQCLean===undefined){

    var rmfbspDivAppend = HTMLDivElement.prototype.appendChild;
    HTMLDivElement.prototype.appendChild = function(){ 
        rmfbspDivAppend.apply(this,arguments); 
        removeADsLink();
    
        //For new fb newsfeed
        removeSponsored();
    }
    HTMLDivElement.prototype.overrideByQCLean = true;

}

//Override UL appendChild
if(HTMLUListElement.prototype.overrideByQCLean===undefined){

    var rmfbspUlAppend = HTMLUListElement.prototype.appendChild;
    HTMLUListElement.prototype.appendChild = function(){ 
        rmfbspUlAppend.apply(this,arguments); 
        removeSponsored();
    }
    HTMLUListElement.prototype.overrideByQCLean = true;

}

