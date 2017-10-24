(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3607701-10', 'auto');
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask',null);
ga('send','pageview');

var manifest = chrome.runtime.getManifest();
ga('send','event','openPopupPage',manifest.version);

// QCLean popup script
var load = function(){
    // setup links
    var settingBtn = document.querySelector("a#settingLink");
    settingBtn.innerHTML = chrome.i18n.getMessage("extSettings");
    settingBtn.onclick = function(e) {
        ga('send','event','openSettingFromPopup',manifest.version);
    };

    var reportBtn = document.querySelector("a#bugReportLink");
    reportBtn.innerHTML = chrome.i18n.getMessage("extReportBug");
    reportBtn.onclick = function(e) {
        ga('send','event','reportBugFromPopup',manifest.version);
    };
};

window.onload = load;
