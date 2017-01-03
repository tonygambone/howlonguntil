
import Actions, { fetchEvents } from '../actions';
import { moment } from '../shims';

// calculate the next instance of an event
function getNextInstance(evt) {
    var startTime = moment(evt.startTime);
    switch (evt.repeat) {
        case "once":
            break;
        case "year":
        case "month":
        case "week":
        case "day":
        case "hour":
        case "minute":
        case "second":
            while (startTime.diff() < 0) {
                startTime.add(1, evt.repeat);
            }
    }
    return startTime;
}

// middleware to do some calculations on new events
// and set up refreshing when they expire
const eventService = store => next => action => {
  switch (action.type) {
      case Actions.EVENTS_RECEIVED:
        let id = 1, nextExpiration = Number.MAX_VALUE;
        action.events = action.events.map((e) => {
            // set id property for key
            e.id = id++;
            // some defaults
            e.displayFormat = e.displayFormat || "dddd, MMMM Do, YYYY";
            e.hideAfter = e.hideAfter || [1, 'day'];
            // calculate next instance of the event
            e.nextInstance = getNextInstance(e);
            // calculate next event expiration
            let expiration = e.nextInstance.diff(moment(), 'ms', true);
            if (expiration > 0) {
                nextExpiration = Math.min(expiration, nextExpiration);
            }
            return e;
        }).filter((e) => {
            // hide events in past after the hideAfter duration
            return e.nextInstance.diff(moment(), e.hideAfter[1]) > -e.hideAfter[0];
        }).sort((a, b) => {
            // sort by time
            return a.nextInstance.valueOf() - b.nextInstance.valueOf();
        });
        // set a timeout for next expire time
        action.refreshTimeout = setTimeout(() => {
            store.dispatch(fetchEvents());
        }, nextExpiration);
      default:
        next(action);
        break;
  }
};

export default eventService;