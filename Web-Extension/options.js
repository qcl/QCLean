var browser = browser || chrome;

var qcleanSettings = qcleanSettings || [];

let optionTemplate = document.querySelector('template#option');
let targetElement = document.querySelector('div#qclean-settings');

// FIXME: check opt-in=1 in search string, check its length is incorrect.
let highlightOpt = (document.location.search.length > 0);

let renderOptions = (targetElement, template, settings) => {
    for(let setting of settings) {
        // clone element from template
        let dom = document.importNode(template.content, true);

        // prepare elements that need to update
        let label = dom.querySelector('label');
        let input = dom.querySelector('input');
        let title = dom.querySelector('span');
        let desc = dom.querySelector('p');
        let div = dom.querySelector('div');

        // get i18n string
        let titleText = browser.i18n.getMessage(setting.title);
        let descText = browser.i18n.getMessage(setting.desc);

        let { key } = setting;
        let query = {};
        query[key] = setting.default;

        browser.storage.sync.get(query, (items) => {
            console.log(`${key} is ${items[key]}`);
            input.defaultChecked = items[key];
            if (input.defaultChecked) {
                label.classList.add('is-checked');
            } else {
                label.classList.remove('is-checked');
            }
        });

        title.textContent = titleText;
        desc.textContent = descText;
        label.setAttribute('for',setting.key);
        input.id = key;
        input.onchange = (e) => {
            let applied = input.checked;
            let query = {};
            query[key] = input.checked;
            browser.storage.sync.set(query, () => {
                console.log(`${key} changed to ${query[key]}`);
            });
        };

        if (highlightOpt && setting.optin) {
            div.classList.add('opt-in-highlight');
        }

        targetElement.appendChild(dom);
    }
};

renderOptions(targetElement, optionTemplate, qcleanSettings);

// init and i18n
let changeContentWithI18Message = (cssQueryString, message) => {
    let messageText = browser.i18n.getMessage(message);
    if (messageText != undefined && messageText.length > 0){
        //console.log(`message ${message} is ${messageText}`);
        let dom = document.querySelector(cssQueryString);
        dom.textContent = messageText;
    }
};

let initOptionsPage = function() {
    let settingTitle = browser.i18n.getMessage("extSettings");
    let manifest = browser.runtime.getManifest();

    document.title = settingTitle;
    document.querySelector("a#version").textContent = manifest.version;

    let messages = [{
        message: "extSettings",
        query: "h3#settingTitle"
    }, {
        message: "extSettingsDesc",
        query: "p#settingDesc"
    }, {
        message: "extShortName",
        query: "a#extName"
    }, {
        message: "extDonate",
        query: "a#donate"
    }, {
        message: "extReportBug",
        query: "a#report"
    }, {
        message: "extPrivacyPolicy",
        query: "a#privacypolicy"
    }];

    for(let message of messages){
        changeContentWithI18Message(message.query, message.message);
    }
};

initOptionsPage();
