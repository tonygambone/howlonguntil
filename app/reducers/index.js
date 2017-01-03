
import Actions from '../actions';

const initialState = { events: [], elapsed: 0 };

export default (state = initialState, action) => {
    if (!state) { state = initialState };
    switch (action.type) {
        case Actions.EVENTS_RECEIVED:
            return {
                ...state,
                events: action.events,
                refreshTimeout: action.refreshTimeout
            };
        case Actions.TICK:
            return {
                ...state,
                elapsed: state.elapsed + 1
            };
        default:
            return state;
    }
};