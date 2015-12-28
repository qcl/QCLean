var Option = React.createClass({
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
                    <span className="mdl-switch__label">OptionName</span>
                </label>
                <p className="option-desc">Description</p>
            </div>
        );
    }
});

React.render(
    <Option id="switch-id" />,
    document.getElementById('setting')
);
