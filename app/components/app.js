import React from 'react';
import { connect } from 'react-redux';
import { EventBox } from './eventBox';

class AppInternal extends React.Component {
    render() {
        var eventBoxes = this.props.events.map((e) => <EventBox event={ e } />);
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div id="container">
                    {eventBoxes}
                </div>
            </div>
        );
    }
}

export const App = connect(
    function mapStateToProps(state) {
        return { events: state.events };
    }
)(AppInternal);