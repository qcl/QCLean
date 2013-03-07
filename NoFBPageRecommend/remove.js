/* 
    Remove Facebook Suggested Pages & Posts 

    Qing-Cheng Li

*/


/* 
    In order to override the HTMLUlistElement.appendChild function for 
    removing <li> of suggested pages/posts, so inject the script kerker.js
    into page. After overriding the function, everytime when a ajax call
    done, facebook add new <li> into news feed will call appendChild,
    at that time, my script will check if the <li> is a suggested post or 
    not.
*/
var script = document.createElement("script");
script.src = chrome.extension.getURL("kerker.js");
(document.head||document.documentElement).appendChild(script);

/*
var mayHasAdsDiv = document.getElementsByClassName("ego_column");
for(var i=0;i<mayHasAdsDiv.length;i++){
    var div = mayHasAdsDiv[i];
    var mayContainAdsDiv = div.getElementsByClassName("ego")
}*/
