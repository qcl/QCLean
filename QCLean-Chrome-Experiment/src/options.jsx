var Option = React.createClass({
    render: function () {
        return (
            <div>
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="switch-id">
                    <input type="checkbox" id="switch-id" className="mdl-switch__input"/>
                    <span className="mdl-switch__label">OptionName</span>
                </label>
                <p className="option-desc">Description</p>
            </div>
        );
    }
});

React.render(
    <Option />,
    document.getElementById('setting')
);
