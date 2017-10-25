//var browser = browser || undefined;
//var chrome = browser || chrome;

var browser = browser || chrome;
let parser = new DOMParser();

var Option = React.createClass({displayName: "Option",
    componentWillMount: function() {
        console.log("componentWillMount");
        // get setting title and description
        this.title = chrome.i18n.getMessage(this.props.titleText);
        this.desc = chrome.i18n.getMessage(this.props.desc);
    },
    componentDidMount: function() {
        console.log("componentDidMount");
        
        // get applied state
        var settingKey = this.props.id;
        var defaultValue = this.props.defaultValue;

        var settingQuery = {};
        settingQuery[settingKey] = defaultValue;
        chrome.storage.sync.get(settingQuery, this.handleSetting);
    },
    getInitialState: function() {
        console.log("getInitialState");
        
        var defaultValue = this.props.defaultValue;
        
        // return init state
        return {
            'isSeetingApplied': defaultValue
        };
    },
    handleSetting: function(items) {
        var settingKey = this.props.id;
        var defaultValue = this.props.defaultValue;
        var isSeetingApplied = items[settingKey];
        if (isSeetingApplied == undefined) {
            isSeetingApplied = defaultValue;
        }
        this.setState({"isSeetingApplied": isSeetingApplied});
    },
    switchDidChanged: function(event) {
        console.log("switchDidChanged");
        var settingKey = this.props.id;
        var items = {};
        items[settingKey] = !this.state.isSeetingApplied;
        chrome.storage.sync.set(items,function(){
            // no-op for now.
        });
        this.setState({"isSeetingApplied": !this.state.isSeetingApplied});
    },
    render: function () {
        console.log("render called");
        var labelClasses = "mdl-switch mdl-js-switch mdl-js-ripple-effect is-upgraded";
        if (this.state.isSeetingApplied) {
            labelClasses += " is-checked";
        }
        return (
            React.createElement("div", null, 
                React.createElement("label", {className: labelClasses, htmlFor: this.props.id}, 
                    React.createElement("input", {type: "checkbox", 
                            id: this.props.id, 
                            className: "mdl-switch__input", 
                            onChange: this.switchDidChanged, 
                            checked: this.state.isSeetingApplied}), 
                    React.createElement("span", {className: "mdl-switch__label"}, this.title)
                ), 
                React.createElement("p", {className: "option-desc"}, this.desc)
            )
        );
    }
});

// TODO mv setting to another file, let it can be shared
var qcleanSettings = [{
    key: "qclean-remove-ads",
    default: true,
    title: "optRemoveAds",
    desc: "optRemoveAdsDesc"
},{
    key: "qclean-remove-recommended-posts",
    default: true,
    title: "optRemoveRecommendedPosts",
    desc: "optRemoveRecommendedPostsDesc" 
},{
    key: "qclean-collaspe-right-panel",
    default: true,
    title: "optCollaspeRightPanel",
    desc: "optCollaspeRightPanelDesc" 
},{
    key: "qclean-remove-games",
    default: true,
    title: "optRemoveGameRecommend",
    desc: "optRemoveGameRecommendDesc" 
},{
    key: "qclean-auto-report",
    default: true,
    title: "optAutoReport",
    desc: "optAutoReportDesc" 
},{
    key: "qclean-debug-mode",
    default: false,
    title: "optDebug",
    desc: "optDebugDesc"
}];

let optionTemplate = document.querySelector('template#option');
let targetElement = document.querySelector('div#qclean-settings');
console.log(optionTemplate);

let renderOptions = (targetElement, template, settings) => {
    for(let setting of settings) {
        console.log(setting);
        // clone element from template
        let dom = document.importNode(template.content, true);

        // prepare elements that need to update
        let label = dom.querySelector('label');
        let input = dom.querySelector('input');
        let title = dom.querySelector('span');
        let desc = dom.querySelector('p');

        // get i18n string
        let titleText = browser.i18n.getMessage(setting.title);
        let descText = browser.i18n.getMessage(setting.desc);

        let { key } = setting;
        let query = {};
        query[key] = setting.default;

        browser.storage.sync.get(query, (items) => {
            console.log(key);
            console.log(items[key]);
            input.defaultChecked = items[key];
            if (input.defaultChecked) {
                label.classList.add('is-checked');
            } else {
                label.classList.remove('is-checked');
            }
            console.log(input);
        });

        title.textContent = titleText;
        desc.textContent = descText;
        label.setAttribute('for',setting.key);
        input.id = key;

        console.log(label);
        console.log(dom);

        targetElement.appendChild(dom);
    }
};

renderOptions(targetElement, optionTemplate, qcleanSettings);

React.render(
    React.createElement("div", null, 
        qcleanSettings.map(function(setting){
            return React.createElement(Option, {id: setting.key, 
                            defaultValue: setting.default, 
                            titleText: setting.title, 
                            desc: setting.desc}); 
        })
    ),
    document.getElementById('setting')
);

// init and i18n
var changeContentWithI18Message = function(cssQueryString, message){
    var messageText = chrome.i18n.getMessage(message);
    if(messageText!=undefined && messageText.length > 0){
        console.log("message"+message+" is "+messageText);
        var dom = document.querySelector(cssQueryString);
        dom.innerHTML = messageText;
    }
};

var initOptionsPage = function() {
    var settingTitle = chrome.i18n.getMessage("extSettings");
    document.title = settingTitle;
    var manifest = chrome.runtime.getManifest();
    document.querySelector("a#version").innerHTML = manifest.version;

    var messages = [{
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
    }];
    for(var i in messages){
        var message = messages[i];
        changeContentWithI18Message(message.query, message.message);
    }
};

initOptionsPage();
