import { AppInternal } from '../../app/components/app';
import renderer from 'react-test-renderer';
import React from 'react';
import { shallow } from 'enzyme';
import { fetchEvents } from '../../app/actions';

describe('the internal app component', () => {
    it('fetches events when the header is clicked', () => {
        let dispatch = jest.fn();
        const app = shallow(
            <AppInternal title="test title" events={[{id:1}, {id:2}, {id:3}]} elapsed="0" dispatch={dispatch} />
        );
        app.find('h1').simulate('click');
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(fetchEvents());
    });

    it('renders an eventbox for each event', () => {
        const app = shallow(
            <AppInternal title="test title" events={[{id:1}, {id:2}, {id:3}]} elapsed="0" />
        );
        let children = app.find('#container').children();
        expect(children.length).toEqual(3);
        for (let i = 0; i < 3; i++) {
            expect(children.at(i).key()).toBe((i+1).toString());
            expect(children.at(i).prop('event')).toBeDefined();
            expect(children.at(i).prop('elapsed')).toBeDefined();
        }
    });

    it('renders the header text', () => {
        const app = shallow(
            <AppInternal title="test title" events={[]} elapsed="0" />
        );
        expect(app.find('h1').text()).toEqual('test title');
    });

    it('matches the basic snapshot', () => {
        const app = renderer.create(
            <AppInternal title="test title" events={[]} elapsed="0" />
        );
        let tree = app.toJSON();
        expect(tree).toMatchSnapshot();
    });
});