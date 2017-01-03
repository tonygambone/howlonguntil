import React from 'react';
import { moment } from '../shims';

// get a string that shows the remaining time (or time since)
function timeRemaining(target) {
    var diff = moment(target).diff(moment(), 'ms', true);
    var str = moment.duration(diff).format('d [days], h [hours], m [minutes], s [seconds]');
    str = str.replace(/(^| )(1 )(.+?)s/g, '$1$2$3'); // singular
    if (diff < 0) {
        str = str.replace(/^-?(.*)$/, '$1 ago');
    }
    return str;
}

export class EventBox extends React.Component {
    render() {
        return (
            <div className="event">
                <h3>{this.props.event.name}</h3>
                <div className="timestamp">{this.props.event.nextInstance.format(this.props.event.displayFormat)}</div>
                <div className="until">{timeRemaining(this.props.event.nextInstance)}</div>
            </div>
        )
    }
}