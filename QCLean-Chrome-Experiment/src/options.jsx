var Option = React.createClass({
    switchDidChanged: function(event) {
        console.log("switchDidChanged");
        console.log(event.target);
    },
    render: function () {
        return (
            <div>
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="switch-id" >
                    <input type="checkbox" id="switch-id" className="mdl-switch__input" onChange={this.switchDidChanged} checked={false} />
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
