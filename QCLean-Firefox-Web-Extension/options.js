/* Google Analytics */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3607701-10', 'auto');
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask', null);
ga('send', 'pageview');

//var rmgBtn  = document.getElementById("rmg");
var rmadBtn = document.getElementById("rmad");
var rmrpBtn = document.getElementById("rmrp");
var hrBtn   = document.getElementById("hr");
var hsBtn   = document.getElementById("hs");
var reportBtn = document.getElementById("report");
var crBtn = document.getElementById("cr");

console.log(localStorage["qclean-rmg"]);
console.log(localStorage["qclean-rmad"]);
console.log(localStorage["qclean-rmrp"]);
console.log(localStorage["qclean-hr"]);
console.log(localStorage["qclean-hs"]);
console.log(localStorage["qclean-report"]);
console.log(localStorage["qclean-cr"]);
/*
if(localStorage["qclean-rmg"]=="true"){
    rmgBtn.innerHTML = "on";
}else{
    rmgBtn.innerHTML = "off";
}
*/
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
if(localStorage["qclean-report"]=="true"){
    reportBtn.innerHTML = "on";
}else{
    reportBtn.innerHTML = "off";
}
if(localStorage["qclean-cr"]=="true"){
    crBtn.innerHTML = "on";
}else{
    crBtn.innerHTML = "off";
}

/*
rmgBtn.onclick = function(){
    console.log(localStorage["qclean-rmg"]);
    if(localStorage["qclean-rmg"]=="true"){
        localStorage["qclean-rmg"] = "false";
        this.innerHTML = "off";
    }else{
        console.log("change to on");
        localStorage["qclean-rmg"] = "true";
        this.innerHTML = "on";
    }
};
*/
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
reportBtn.onclick = function(){
    if(localStorage["qclean-report"]=="true"){
        localStorage["qclean-report"] = "false";
        this.innerHTML = "off";
    }else{
        localStorage["qclean-report"] = "true";
        this.innerHTML = "on";
    }
};
crBtn.onclick = function(){
    if(localStorage["qclean-cr"]=="true"){
        localStorage["qclean-cr"] = "false";
        this.innerHTML = "off";
    }else{
        localStorage["qclean-cr"] = "true";
        this.innerHTML = "on";
    }
};
