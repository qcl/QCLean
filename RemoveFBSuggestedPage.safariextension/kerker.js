var f = HTMLUListElement.prototype.appendChild;

var removeLikePage = function(){

    var k = document.getElementsByClassName("uiLikePage");
    if(k.length>0){
        for(var i=0;i<k.length;i++){
            var n = k[i];
            var found = true;
            while(n.parentNode.nodeName!="LI"){
                if(n.parentNode.nodeName=="BODY"){
                    break;
                    found = false;
                }
                n = n.parentNode;
            }
            if(found){
                n = n.parentNode;
                n.parentNode.removeChild(n);
                console.log('Remove!');
            }
        }
    }

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
                console.log('Remove!!');
            }
        }
    }
}

//removeLikePage();

//Override appendChild function
HTMLUListElement.prototype.appendChild = function(){
    f.apply(this,arguments);
    removeLikePage();
}

