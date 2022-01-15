import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import ProfileSettings from './ProfileSettings'
describe('Management panel', () => {
        const component = render(<ProfileSettings/>);
        const institution = component.container.querySelector('#buttonManagementPanel__intitutions')
        fireEvent.click(institution);
        expect(institution).toHaveStyle('display:none');
  });