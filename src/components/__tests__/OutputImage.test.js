/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import OutputImage from '../OutputImage';

const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

describe('OutputImage suite', () => {
    it('should render without throwing an error', () => {
        const row = {
            body: img,
            host: '',
            disabled: false,
        };

        const outputImage = shallow(<OutputImage row={row} />);

        expect(outputImage).toBeTruthy();
    });
});
