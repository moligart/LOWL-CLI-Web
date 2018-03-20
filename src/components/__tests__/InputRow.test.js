/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import InputRow from '../InputRow';

describe('InputRow suite', () => {
    it('renders without throwing errors', () => {
        const row = {
            body: '',
            host: '~',
            disabled: false,
        };

        const inputRow = shallow(<InputRow row={row} />);

        expect(inputRow).toBeTruthy();
    });
});

