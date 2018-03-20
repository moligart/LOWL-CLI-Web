/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import OutputPDF from '../OutputPDF';

const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

jest.mock('../OutputPDF');

describe('OutputPDF suite', () => {
    beforeEach(() => {
        require('../OutputPDF');
    });

    it('should render without throwing an error', () => {
        const row = {
            body: img,
            host: '',
            disabled: false,
        };

        const outputPDF = shallow(<OutputPDF row={row} />);

        expect(outputPDF).toBeTruthy();
    });
});
