import React from 'react';
import { connect } from 'react-redux';
import { EventBox } from './eventBox';
import { fetchEvents } from '../actions';

class AppInternal extends React.Component {
    headerClicked() {
        this.props.dispatch(fetchEvents());
    }

    render() {
        var eventBoxes = this.props.events.map((e) => <EventBox key={e.id} event={e} elapsed={this.props.elapsed} />);
        return (
            <div>
                <h1 onClick={this.headerClicked.bind(this)}>{this.props.title}</h1>
                <div id="container">
                    {eventBoxes}
                </div>
            </div>
        );
    }
}

export const App = connect(
    function mapStateToProps(state) {
        return { events: state.events, elapsed: state.elapsed };
    }
)(AppInternal);