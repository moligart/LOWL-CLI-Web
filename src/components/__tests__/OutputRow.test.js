/* eslint-disable */

import React from 'react';
import { shallow } from 'enzyme';
import OutputRow from '../OutputRow';

it('OutputRow renders simple text output', () => {
    const row = {
        body: 'test',
        host: '',
        disabled: false,
    };

    const outputRow = shallow(<OutputRow row={row} />);

    expect(outputRow.text()).toEqual(row.body);
});

it('OutputRow renders an array of text', () => {
    const row = {
        body: ['test', 'array', 'output'],
        host: '',
        disabled: false,
    };

    const outputRow = shallow(<OutputRow row={row} />);

    setTimeout(() => {
        expect(outputRow.text()).toEqual(row.body.join(' '));
        done();
    }, 300);
});
