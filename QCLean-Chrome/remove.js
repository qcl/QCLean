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
(document.head||document.documentElement).appendChild(qclean.script);

console.log(localStorage["qclean-version"]);
