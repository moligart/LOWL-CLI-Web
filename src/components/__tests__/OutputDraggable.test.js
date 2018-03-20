/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import OutputDraggable from '../OutputDraggable';
import { ROW_TYPES } from '../../constants/constants';

const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

let wasClicked = false;

const removeComponent = () => {
    wasClicked = true;
};

const setTutorialState = () => {
    wasClicked = true;
};

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
            type: ROW_TYPES.ROW_TYPE_PDF,
            data: { title: 'Some Document' },
        };

        const outputDraggable = shallow(<OutputDraggable row={row} rk="prev-1" removeComponent={removeComponent} />);

        expect(outputDraggable).toBeTruthy();
    });
});
