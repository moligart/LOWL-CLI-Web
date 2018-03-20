/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import ItemTray from '../ItemTray';

describe('ITemTray suite', () => {
    it('renders without throwing errors', () => {
        const itemTray = shallow(<ItemTray />);
        expect(itemTray).toBeTruthy();
    });
});