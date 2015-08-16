var Option = React.createClass({displayName: "Option",
    getInitialState: function() {
        // TODO get init state from chrome's setting
        console.log("getInitialState");

        // just check here already can read props
        console.log(this.props);

        return {
            'isSeetingApplied': false
        };
    },
    switchDidChanged: function(event) {
        console.log("switchDidChanged");
        //console.log(event.target);
        // UI changed but the state of input not change, need to set state.
        // UI may change by other js ?
        this.setState({"isSeetingApplied": !this.state.isSeetingApplied});
    },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("label", {className: "mdl-switch mdl-js-switch mdl-js-ripple-effect", htmlFor: this.props.id}, 
                    React.createElement("input", {type: "checkbox", 
                            id: this.props.id, 
                            className: "mdl-switch__input", 
                            onChange: this.switchDidChanged, 
                            checked: this.state.isSeetingApplied}), 
                    React.createElement("span", {className: "mdl-switch__label"}, "OptionName")
                ), 
                React.createElement("p", {className: "option-desc"}, "Description")
            )
        );
    }
});

React.render(
    React.createElement(Option, {id: "switch-id"}),
    document.getElementById('setting')
);
