/* GA */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-3607701-4']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
    //ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var rmadBtn = document.getElementById("rmad");
var rmrpBtn = document.getElementById("rmrp");
var hrBtn   = document.getElementById("hr");
var hsBtn   = document.getElementById("hs");

console.log(localStorage["qclean-rmad"]);
console.log(localStorage["qclean-rmrp"]);
console.log(localStorage["qclean-hr"]);
console.log(localStorage["qclean-hs"]);
if(localStorage["qclean-rmad"]=="true"){
    rmadBtn.innerHTML = "on";
}else{
    rmadBtn.innerHTML = "off";
}
if(localStorage["qclean-rmrp"]=="true"){
    rmrpBtn.innerHTML = "on";
}else{
    rmrpBtn.innerHTML = "off";
}
if(localStorage["qclean-hr"]=="true"){
    hrBtn.innerHTML = "on";
}else{
    hrBtn.innerHTML = "off";
}
if(localStorage["qclean-hs"]=="true"){
    hsBtn.innerHTML = "on";
}else{
    hsBtn.innerHTML = "off";
}

rmadBtn.onclick = function(){
    console.log(localStorage["qclean-rmad"]);
    if(localStorage["qclean-rmad"]=="true"){
        localStorage["qclean-rmad"] = "false";
        this.innerHTML = "off";
    }else{
        console.log("change to on");
        localStorage["qclean-rmad"] = "true";
        this.innerHTML = "on";
    }
};
rmrpBtn.onclick = function(){
    if(localStorage["qclean-rmrp"]=="true"){
        localStorage["qclean-rmrp"] = "false";
        this.innerHTML = "off";
    }else{
        localStorage["qclean-rmrp"] = "true";
        this.innerHTML = "on";
    }
};
hrBtn.onclick = function(){
    if(localStorage["qclean-hr"]=="true"){
        localStorage["qclean-hr"] = "false";
        this.innerHTML = "off";
    }else{
        localStorage["qclean-hr"] = "true";
        this.innerHTML = "on";
    }
};
hsBtn.onclick = function(){
    if(localStorage["qclean-hs"]=="true"){
        localStorage["qclean-hs"] = "false";
        this.innerHTML = "off";
    }else{
        localStorage["qclean-hs"] = "true";
        this.innerHTML = "on";
    }
};
