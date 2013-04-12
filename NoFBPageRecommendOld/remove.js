/* 
    QCLean
    Remove Facebook Ads, Suggested Pages & Posts 

    Qing-Cheng Li

*/
console.log('Load remove.js');

//console.log(chrome.i18n.getMessage("extAvailableOnStore"));

/*  Goto web store! */
var script = document.createElement("script");
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js";
(document.head||document.documentElement).appendChild(script);


script = document.createElement("script");
script.src = chrome.extension.getURL("jquery.noty.js");
(document.head||document.documentElement).appendChild(script);

script = document.createElement("script");
script.src = chrome.extension.getURL("top.js");
(document.head||document.documentElement).appendChild(script);

script = document.createElement("script");
script.src = chrome.extension.getURL("default.js");
(document.head||document.documentElement).appendChild(script);
/* 
    In order to override the HTMLUlistElement.appendChild function for 
    removing <li> of suggested pages/posts, so inject the script kerker.js
    into page. After overriding the function, everytime when a ajax call
    done, facebook add new <li> into news feed will call appendChild,
    at that time, my script will check if the <li> is a suggested post or 
    not.
*/
var qclean_script = document.createElement("script");
qclean_script.src = chrome.extension.getURL("qclean.js");
(document.head||document.documentElement).appendChild(qclean_script);

