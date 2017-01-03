
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { App } from './components/app';
import reducer from './reducers';
import Actions from './actions';
import dataService from './services/data';
import eventService from './services/event';
import './app.css';

const store = createStore(
    reducer,
    undefined,
    applyMiddleware(dataService, eventService)
);

render(
    <Provider store={store}>
        <App title="How Long Until?" />
    </Provider>,
    document.getElementById('app')
);

store.dispatch({ type: Actions.FETCH });

setInterval(() => {
    store.dispatch({ type: Actions.TICK });
}, 1000);