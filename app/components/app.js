import React from 'react';
import { EventBox } from './eventBox';
import moment from 'moment';

export class App extends React.Component {
    render() {
        var testEvent = {
            name: "Test event",
            nextInstance: moment().subtract(10, 'days'),
            displayFormat: "dddd, MMMM Do, YYYY"
        };
        return (
            <div>
                <h1>{this.props.title}</h1>
                <div id="container">
                    <EventBox event={ testEvent } />
                </div>
            </div>
        );
    }
}