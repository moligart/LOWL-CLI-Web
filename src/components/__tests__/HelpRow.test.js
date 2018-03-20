/* eslint-disable */

import React from 'react';
import { shallow, mount } from 'enzyme';
import HelpRow from '../HelpRow';

let wasClicked = false;

const autoCompleteCommand = () => {
    wasClicked = true;
};

const setTutorialState = () => {
    wasClicked = true;
};

describe('HelpRow suite', () => {
    it('should render without throwing an error', () => {
        const helpRow = shallow(<HelpRow
            autoCompleteCommand={autoCompleteCommand}
            setTutorialState={setTutorialState}
        />);

        expect(helpRow.is('.HelpRow-host')).toBe(true);
    });

    it('autoComplete should fire parent function', () => {
        const helpRow = shallow(<HelpRow
            autoCompleteCommand={autoCompleteCommand}
            setTutorialState={setTutorialState}
        />);

        helpRow.find('span.cmd').first().simulate('click');
        expect(wasClicked).toBe(true);
        wasClicked = false;
    });

    it('expanded help toggle should unhide tutorial', () => {
        const helpRow = shallow(<HelpRow
            autoCompleteCommand={autoCompleteCommand}
            setTutorialState={setTutorialState}
        />);

        expect(helpRow.find('div.HelpRow-expandedHelp.hide').length).toBe(1);
        helpRow.find('span.cmd').at(1).simulate('click');

        expect(wasClicked).toBe(true);
        expect(helpRow.find('div.HelpRow-expandedHelp.hide').length).toBe(0);
        wasClicked = false;
    });

    it('generates an error when inputing the wrong tutorial value', () => {
        const helpRow = mount(<HelpRow
            autoCompleteCommand={autoCompleteCommand}
            setTutorialState={setTutorialState}
        />);

        helpRow.find('input').value = 'pleh';
        helpRow.instance().checkInput({ keyCode: 13 });
        helpRow.update();

        expect(helpRow.find('div.tutorial-msg.error-msg').length).toBe(1);
        expect(helpRow.find('div.tutorial-msg.success-msg').length).toBe(0);
    });

    it('generated success messaging when correct tutorial value is entered, and user is able to exit', () => {
        const helpRow = mount(<HelpRow
            autoCompleteCommand={autoCompleteCommand}
            setTutorialState={setTutorialState}
        />);

        helpRow.find('span.cmd').at(1).simulate('click');
        expect(helpRow.find('div.HelpRow-expandedHelp.hide').length).toBe(0);

        helpRow.find('input').value = 'help';
        helpRow.instance().checkInput({ keyCode: 13 });

        expect(helpRow.find('div.tutorial-msg.error-msg').length).toBe(0);
        expect(helpRow.find('div.tutorial-msg.success-msg').length).toBe(1);

        helpRow.find('button').simulate('click');
        helpRow.update();

        expect(helpRow.find('div.HelpRow-expandedHelp.hide').length).toBe(1);
    });
});
