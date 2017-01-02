
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './components/app';
import moment from 'moment';
import './app.css';

const store = createStore(
    (s,a) => s, // no actions yet
    { events:
        [{ // test data
            name: "Test event 1",
            nextInstance: moment().subtract(10, 'days'),
            displayFormat: "dddd, MMMM Do, YYYY"
        },{
            name: "Test event 2",
            nextInstance: moment().subtract(9, 'days'),
            displayFormat: "dddd, MMMM Do, YYYY"
        }]
    }
);

render(
    <Provider store={store}>
        <App title="How Long Until?" />
    </Provider>,
    document.getElementById('app')
);