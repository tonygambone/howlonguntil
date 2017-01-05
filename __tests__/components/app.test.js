import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import moment from 'moment';
import React from 'react';
import { App, AppInternal } from '../../app/components/app';
import { fetchEvents } from '../../app/actions';

describe('the connected app component', () => {
    it('populates props from store state', () => {
        const store = createStore(
            (s) => s,
            { events: [
                {id:1, startTime: moment().toISOString(), nextInstance: moment(), displayFormat: "YYYY", hideAfter: [1, 'day'] },
                {id:2, startTIme: moment().toISOString(), nextInstance: moment(), displayFormat: "YYYY", hideAfter: [1, 'day'] }], elapsed: 123 });

        const wrapped = mount(
            <Provider store={store}>
                <App title="foo" />
            </Provider>
        );

        let app = wrapped.find(AppInternal);

        expect(app.prop('events').length).toBe(2);
        expect(app.prop('elapsed')).toBe(123);
    });

    it('uses the store\'s dispatch function', () => {
        const reducer = jest.fn((s,a) => s);
        const state = { events: [
                {id:1, startTime: moment().toISOString(), nextInstance: moment(), displayFormat: "YYYY", hideAfter: [1, 'day'] },
                {id:2, startTIme: moment().toISOString(), nextInstance: moment(), displayFormat: "YYYY", hideAfter: [1, 'day'] }], elapsed: 123 };
        const store = createStore(reducer, state);
        expect(reducer).toHaveBeenCalledTimes(1);

        const wrapped = mount(
            <Provider store={store}>
                <App title="foo" />
            </Provider>
        );

        let app = wrapped.find(AppInternal);
        wrapped.find('h1').simulate('click');
        expect(reducer).toHaveBeenCalledTimes(2);
        expect(reducer).toHaveBeenCalledWith(state, fetchEvents());
    });
});