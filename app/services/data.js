
import Actions from '../actions';

// middleware to fetch event data asynchronously
const dataService = store => next => action => {
  next(action);
  switch (action.type) {
      case Actions.FETCH:
        let refreshTimeout = store.getState().refreshTimeout;
        if (refreshTimeout) clearTimeout(refreshTimeout);
        fetch('events.json')
            .then((response) => {
                return response.json();
            }).then((events) => {
                return next({ type: Actions.EVENTS_RECEIVED, events });
            });
        break;
      default:
        break;
  }
};

export default dataService;