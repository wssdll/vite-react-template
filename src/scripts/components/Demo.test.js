import React from 'react';
import { shallow } from 'enzyme';
import Demo from "./Demo";
import {ContainerDiv} from "./LoginApp";

describe('Demo', () => {
    it('Demo Render Perfectly', () => {
        const wrapper = shallow(<Demo/>);
        expect(wrapper.text()).toEqual('123')
        expect(wrapper.find('.foo')).toHaveLength(1)
    });
});
