
import Actions, { fetchEvents } from '../app/actions';

describe('the actions module', () => {
    it('exports action type constants', () => {
        expect(Actions).toBeDefined();
        expect(Actions.FETCH).toBeDefined();
        expect(Actions.EVENTS_RECEIVED).toBeDefined();
        expect(Actions.TICK).toBeDefined();
    });

    it('exports unique action type constants', () => {
        expect(Actions.FETCH).not.toEqual(Actions.EVENTS_RECEIVED);
        expect(Actions.TICK).not.toEqual(Actions.EVENTS_RECEIVED);
    });

    it('exports a fetchEvents function', () => {
        expect(fetchEvents).toBeDefined();
        let result = fetchEvents();
        expect(result).toBeDefined();
        expect(result.type).toEqual(Actions.FETCH);
    });
});