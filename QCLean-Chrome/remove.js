/* 
    QCLean
    Remove Facebook Ads, Suggested Pages & Posts 

    Qing-Cheng Li

*/
console.log('Load remove.js');

var qclean = qclean || {};


/* 
    In order to override the HTMLUlistElement.appendChild function for 
    removing <li> of suggested pages/posts, so inject the script qclean.js
    into page. After overriding the function, everytime when a ajax call
    done, facebook add new <li> into news feed will call appendChild,
    at that time, my script will check if the <li> is a suggested post or 
    not.
*/
qclean.script = document.createElement("script");
qclean.script.src = chrome.extension.getURL("qclean.js");

qclean.apiStory = document.createElement("script");
qclean.apiStory.src = "https://qcl.github.io/QCLean/api/story.js";
qclean.apiLineTagging = document.createElement("script");
qclean.apiLineTagging.src = "https://qcl.github.io/QCLean/api/lineTagging.js";

qclean.settings = document.createElement("script");
//image for hide information used.
qclean.logoSrc = chrome.extension.getURL("qclean38.png");
qclean.settings.innerHTML = "var qclean = qclean || {};\nqclean.logoSrc=\""+qclean.logoSrc+"\";\n";

//send message to background for getting settings
chrome.runtime.sendMessage({request:"getSettings"},function(response){
    console.log("get QCLean settings");
    //console.log(response);

    if(response.rmg=="true"){
        qclean.settings.innerHTML += "qclean.settingRmg = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingRmg = false;\n";
    }
    if(response.rmad=="true"){
        qclean.settings.innerHTML += "qclean.settingRmad = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingRmad = false;\n";
    }
    if(response.rmrp=="true"){
        qclean.settings.innerHTML += "qclean.settingRmrp = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingRmrp = false;\n";
    }
    if(response.hr=="true"){
        qclean.settings.innerHTML += "qclean.settingHr = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingHr = false;\n";
    }
    if(response.hs=="true"){
        qclean.settings.innerHTML += "qclean.settingHs = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingHs = false;\n";
    }
    if(response.report=="true"){
        qclean.settings.innerHTML += "qclean.settingReport = true;\n";
    }else{
        qclean.settings.innerHTML += "qclean.settingReport = false;\n";
    }

    (document.head||document.documentElement).appendChild(qclean.apiLineTagging);
    (document.head||document.documentElement).appendChild(qclean.apiStory);
    (document.head||document.documentElement).appendChild(qclean.settings);
    (document.head||document.documentElement).appendChild(qclean.script);
});
