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
    key: "qclean-hide-pokemon-go",
    default: false,
    title: "optPokemon",
    desc: "optPokemonDesc"
},{
    key: "qclean-debug-mode",
    default: false,
    title: "optDebug",
    desc: "optDebugDesc"
}];

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
