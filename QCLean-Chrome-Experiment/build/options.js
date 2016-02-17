var Option = React.createClass({displayName: "Option",
    getInitialState: function() {
        console.log("getInitialState");

        // get applied state
        var settingKey = this.props.id;
        // TODO use chrome.storage.sync.get to get setting 
        // but it need `storage` permission, so here still use old solution.
        var applied = localStorage[settingKey];
        if (applied == undefined) {
            //applied = this.props.default;
            applied = true;
        }

        // TODO get setting title and description
        this.title = "OptionName";

        // return state
        return {
            'isSeetingApplied': applied
        };
    },
    switchDidChanged: function(event) {
        console.log("switchDidChanged");
        //console.log(event.target);
        // UI changed but the state of input not change, need to set state.
        // UI may change by other js ?
        // TODO set setting back
        this.setState({"isSeetingApplied": !this.state.isSeetingApplied});
    },
    render: function () {
        console.log("render called");
        return (
            React.createElement("div", null, 
                React.createElement("label", {className: "mdl-switch mdl-js-switch mdl-js-ripple-effect", htmlFor: this.props.id}, 
                    React.createElement("input", {type: "checkbox", 
                            id: this.props.id, 
                            className: "mdl-switch__input", 
                            onChange: this.switchDidChanged, 
                            checked: this.state.isSeetingApplied}), 
                    React.createElement("span", {className: "mdl-switch__label"}, this.title)
                ), 
                React.createElement("p", {className: "option-desc"}, "Description")
            )
        );
    }
});

// TODO add default setting
var qcleanSettings = ["qclean-remove-ads", "qclean-remove-recommended-posts"];

React.render(
    React.createElement("div", null, 
        qcleanSettings.map(function(settingKey){
            return React.createElement(Option, {id: settingKey});                                        
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
