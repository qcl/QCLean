var browser = chrome;

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-3607701-10', 'auto');
//read https://code.google.com/p/analytics-issues/issues/detail?id=312 for more information.
ga('set','checkProtocolTask',null);
ga('send','pageview');

var manifest = browser.runtime.getManifest();
ga('send','event','openPopupPage',manifest.version);

// QCLean popup script
let load = () => {
    // setup links
    let settingBtn = document.querySelector("a#settingLink");
    settingBtn.textContent = browser.i18n.getMessage("extSettings");
    settingBtn.onclick = (e) => {
        e.preventDefault();
        browser.tabs.create({
            url: browser.runtime.getURL("options.html")
        });
        ga('send','event','openSettingFromPopup',manifest.version);
    };

    let reportBtn = document.querySelector("a#bugReportLink");
    reportBtn.textContent = browser.i18n.getMessage("extReportBug");
    reportBtn.onclick = (e) => {
        ga('send','event','reportBugFromPopup',manifest.version);
    };

    let ppBtn = document.querySelector("a#privacyPolicyLink");
    ppBtn.textContent = browser.i18n.getMessage('extPrivacyPolicy');
};

window.onload = load;
