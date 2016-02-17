var Option = React.createClass({
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
            <div>
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor={this.props.id} >
                    <input  type="checkbox" 
                            id={this.props.id} 
                            className="mdl-switch__input" 
                            onChange={this.switchDidChanged} 
                            checked={this.state.isSeetingApplied} />
                    <span className="mdl-switch__label">{this.title}</span>
                </label>
                <p className="option-desc">Description</p>
            </div>
        );
    }
});

// TODO add default setting
var qcleanSettings = ["qclean-remove-ads", "qclean-remove-recommended-posts"];

React.render(
    <div>
        {qcleanSettings.map(function(settingKey){
            return <Option id={settingKey} />;                                        
        })}
    </div>,
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
