
const Actions = {
    FETCH: 'FETCH',
    EVENTS_RECEIVED: 'EVENTS_RECEIVED',
    TICK: 'TICK'
};

export const fetchEvents = function() {
    return {
        type: Actions.FETCH
    };
};

export default Actions;