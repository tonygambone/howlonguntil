import eventService from '../../app/services/event';
import Actions from '../../app/actions';
import moment from 'moment';

describe('the event service', () => {

    let loadEvents = () => {
        let fs = require('fs');
        return JSON.parse(fs.readFileSync(require.resolve('../../build/events.example.json')));
    };

    let next = jest.fn();

    let store = {
        getState: jest.fn(() => {
            return {};
        })
    };

    window.setTimeout = jest.fn();

    let clearAllMocks = () => {
        next.mockClear();
        store.getState.mockClear();
        window.setTimeout.mockClear();
    };

    beforeEach(() => {
        clearAllMocks();
    });

    it('always calls next once for any event', () => {
        eventService(store)(next)({ type: Actions.FETCH });
        expect(next).toHaveBeenCalledTimes(1);
        eventService(store)(next)({ type: Actions.EVENTS_RECEIVED, events: [] });
        expect(next).toHaveBeenCalledTimes(2);
        eventService(store)(next)({ type: Actions.TICK });
        expect(next).toHaveBeenCalledTimes(3);
    });

    it('assigns ids to events', () => {
        let action = { type: Actions.EVENTS_RECEIVED, events: loadEvents() };
        eventService(store)(next)(action);
        action.events.forEach((e) => {
            expect(e.id).toBeDefined();
        });
    });

    it('sets a default display format', () => {
        let action = { type: Actions.EVENTS_RECEIVED, events: loadEvents() };
        eventService(store)(next)(action);
        action.events.forEach((e) => {
            expect(e.displayFormat).toBeDefined();
        });
    });

    it('sets a default hideAfter interval', () => {
        let action = { type: Actions.EVENTS_RECEIVED, events: loadEvents() };
        eventService(store)(next)(action);
        action.events.forEach((e) => {
            expect(e.hideAfter).toBeDefined();
        });
    });

    it('calculates the next instance of events', () => {
        let events = loadEvents();
        events.push({ name: "A", repeat: "once", startTime: "2009-01-01T00:00:00", hideAfter: [ 1000, "years" ] }); // note to self: revisit in 3009
        events.push({ name: "X", repeat: "week", startTime: "2017-01-01T00:00:00" });
        events.push({ name: "Y", repeat: "month", startTime: "2017-01-01T00:00:00" });
        events.push({ name: "Z", repeat: "year", startTime: "2017-01-01T00:00:00" });
        let action = { type: Actions.EVENTS_RECEIVED, events: events };
        eventService(store)(next)(action);
        action.events.forEach((e) => {
            expect(e.nextInstance).toBeDefined();
        });
        let a = action.events.filter((e) => e.name == "A")[0];
        let x = action.events.filter((e) => e.name == "X")[0];
        let y = action.events.filter((e) => e.name == "Y")[0];
        let z = action.events.filter((e) => e.name == "Z")[0];
        // this one is in the past
        expect(moment().diff(a.nextInstance, 'year', true)).toBeGreaterThan(0);
        // these will be in the future but nearby
        expect(moment().diff(x.nextInstance, 'week', true)).toBeLessThan(0);
        expect(moment().diff(x.nextInstance, 'week', true)).toBeGreaterThan(-1);
        expect(moment().diff(y.nextInstance, 'month', true)).toBeLessThan(0);
        expect(moment().diff(y.nextInstance, 'month', true)).toBeGreaterThan(-1);
        expect(moment().diff(z.nextInstance, 'year', true)).toBeLessThan(0);
        expect(moment().diff(z.nextInstance, 'year', true)).toBeGreaterThan(-1);
    });

    it('sets a refresh timeout for the next expiring event', () => {
        let action = { type: Actions.EVENTS_RECEIVED, events: loadEvents() };
        let oldTimeout = window.setTimeout;
        let timeoutValue = 0;
        window.setTimeout = jest.fn((func,t) => {
            timeoutValue = t;
            return 225;
        });
        eventService(store)(next)(action);
        expect(timeoutValue).toBeGreaterThan(0);
        expect(action.refreshTimeout).toBe(225);
        window.setTimeout = oldTimeout;
    });

    it('filters out hidden events but leaves in unexpired ones', () => {
        let events = loadEvents();
        events.push({ name: "X", repeat: "once", startTime: "2009-01-01T00:00:00" });
        events.push({ name: "Y", repeat: "once", startTime: "2009-01-01T00:00:00", hideAfter: [ 1000, "years" ] });
        events.push({ name: "Z", repeat: "week", startTime: "2009-01-01T00:00:00" });
        let action = { type: Actions.EVENTS_RECEIVED, events: events };
        eventService(store)(next)(action);
        let x = action.events.filter((e) => e.name == "X");
        let y = action.events.filter((e) => e.name == "Y");
        let z = action.events.filter((e) => e.name == "Z");
        expect(x.length).toBe(0);
        expect(y.length).toBe(1);
        expect(z.length).toBe(1);
    });

    it('sorts events by time', () => {
        let events = loadEvents();
        events.push({ name: "X", repeat: "year", startTime: "2017-01-03T00:00:00" });
        events.push({ name: "Y", repeat: "year", startTime: "2017-01-02T00:00:00" });
        events.push({ name: "Z", repeat: "year", startTime: "2017-01-01T00:00:00" });
        let action = { type: Actions.EVENTS_RECEIVED, events: events };
        eventService(store)(next)(action);
        action.events.reduce((p,c) => {
            expect(c.nextInstance.valueOf()).toBeGreaterThanOrEqual(p);
            return c.nextInstance.valueOf();
        }, 0);
    });
});