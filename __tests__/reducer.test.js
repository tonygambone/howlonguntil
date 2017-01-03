
import Actions from '../app/actions';
import reducer from '../app/reducers';

describe('the main reducer', () => {
  it('returns initial state when called without state', () => {
      let result = reducer();
      expect(result).toBeDefined();
      expect(result.events).toEqual([]);
      expect(result.elapsed).toEqual(0);
  });

  it('updates state based on the EVENTS_RECEIVED event', () => {
      let result = reducer({a:1}, { type: Actions.EVENTS_RECEIVED, events: [{b:2}], refreshTimeout: 3 });
      expect(result).toBeDefined();
      expect(result.a).toEqual(1);
      expect(result.events.length).toEqual(1);
      expect(result.events[0].b).toEqual(2);
      expect(result.refreshTimeout).toEqual(3);
  });

  it('updates state based on the TICK event', () => {
      let result = reducer({a:1, elapsed: 8}, { type: Actions.TICK });
      expect(result).toBeDefined();
      expect(result.a).toEqual(1);
      expect(result.elapsed).toEqual(9);
      result = reducer(result, { type: Actions.TICK });
      expect(result.elapsed).toEqual(10);
  });
});