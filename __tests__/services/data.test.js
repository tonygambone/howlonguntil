import dataService from '../../app/services/data';
import Actions from '../../app/actions';

describe('the data service', () => {
    let fetchAction = {
        type: Actions.FETCH
    };

    let receivedAction = {
        type: Actions.EVENTS_RECEIVED,
        events: []
    };

    let next = jest.fn();

    let store = {
        getState: jest.fn(() => {
            return { refreshTimeout: 127 };
        })
    };

    let jsonPromise = {
        then: jest.fn((func) => {
            func([]);
        })
    }

    let fetchResponse = {
        json: jest.fn()
    }

    let fetchPromise = {
        then: jest.fn((func) => {
            func(fetchResponse);
            return jsonPromise;
        })
    };

    window.fetch = jest.fn((url) => {
        return fetchPromise;
    });

    window.clearTimeout = jest.fn();

    let clearAllMocks = () => {
        next.mockClear();
        store.getState.mockClear();
        jsonPromise.then.mockClear();
        fetchResponse.json.mockClear();
        fetchPromise.then.mockClear();
        window.fetch.mockClear();
        window.clearTimeout.mockClear();
    };

    beforeEach(() => {
        clearAllMocks();
    });

    it('calls the next function twice for fetch', () => {
        dataService(store)(next)(fetchAction);
        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(fetchAction);
        expect(next).toHaveBeenCalledWith(receivedAction);
    });

    it('calls the next function once for non-fetch', () => {
        dataService(store)(next)(receivedAction);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(receivedAction);
        expect(window.fetch).toHaveBeenCalledTimes(0);
        expect(fetchPromise.then).toHaveBeenCalledTimes(0);
        expect(fetchResponse.json).toHaveBeenCalledTimes(0);
        expect(jsonPromise.then).toHaveBeenCalledTimes(0);
        expect(store.getState).toHaveBeenCalledTimes(0);
        expect(window.clearTimeout).toHaveBeenCalledTimes(0);
    });

    it('fetches and parses the events', () => {
        dataService(store)(next)(fetchAction);
        expect(window.fetch).toHaveBeenCalledTimes(1);
        expect(window.fetch).toHaveBeenCalledWith('events.json');
        expect(fetchPromise.then).toHaveBeenCalledTimes(1);
        expect(fetchResponse.json).toHaveBeenCalledTimes(1);
        expect(jsonPromise.then).toHaveBeenCalledTimes(1);
    });

    it('clears the timeout', () => {
        dataService(store)(next)(fetchAction);
        expect(store.getState).toHaveBeenCalledTimes(1);
        expect(window.clearTimeout).toHaveBeenCalledTimes(1);
        expect(window.clearTimeout).toHaveBeenCalledWith(127);
    });
});