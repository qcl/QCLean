var Option = React.createClass({displayName: "Option",
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement("label", {className: "mdl-switch mdl-js-switch mdl-js-ripple-effect", htmlFor: "switch-id"}, 
                    React.createElement("input", {type: "checkbox", id: "switch-id", className: "mdl-switch__input"}), 
                    React.createElement("span", {className: "mdl-switch__label"}, "OptionName")
                ), 
                React.createElement("p", {className: "option-desc"}, "Description")
            )
        );
    }
});

React.render(
    React.createElement(Option, null),
    document.getElementById('setting')
);
