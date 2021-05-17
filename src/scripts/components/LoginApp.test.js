import React from 'react';
import { shallow } from 'enzyme';
import LoginApp, {ContainerDiv} from "./LoginApp";

describe('Login Render', () => {
    it('Login perfectly', () => {
        const wrapper = shallow(<LoginApp/>);
        expect(wrapper.find(ContainerDiv)).toHaveLength(1)
    });
});
