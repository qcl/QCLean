var browser = browser || chrome;

let manifest = browser.runtime.getManifest();

browser.runtime.sendMessage({
    'request': 'i13n',
    'event': 'OpenPopupPage'
}, (response) => {
    // no-op for now.
});

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
        browser.runtime.sendMessage({
            'request': 'i13n',
            'event': 'OpenSettingFromPopup'
        }, (response) => {
            // no-op for now.
        });
    };

    let reportBtn = document.querySelector("a#bugReportLink");
    reportBtn.textContent = browser.i18n.getMessage("extReportBug");
    reportBtn.onclick = (e) => {
        browser.runtime.sendMessage({
            'request': 'i13n',
            'event': 'ReportBugFromPopup'
        }, (response) => {
            // no-op for now.
        });
    };

    let ppBtn = document.querySelector("a#privacyPolicyLink");
    ppBtn.textContent = browser.i18n.getMessage('extPrivacyPolicy');
};

window.onload = load;
