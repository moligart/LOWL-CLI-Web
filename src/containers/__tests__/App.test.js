import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App/App';

jest.mock('../../components/OutputPDF');

describe('App suite', () => {
    beforeEach(() => {
        require('../../components/OutputPDF');
    });

    it('should render without throwing an error', () => {
        const div = document.createElement('div');
        fetch.mockResponse(JSON.stringify({ sid: '12345' }));
        expect(ReactDOM.render(<App />, div)).toBeTruthy();
    });
});
