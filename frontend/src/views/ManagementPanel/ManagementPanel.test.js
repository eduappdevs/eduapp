import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import ManagementPanel from './ManagementPanel'
describe('Management panel',()=>{
    test('Open institutions option:', () => {
        const component = render(<ManagementPanel/>);
        const institution = component.container.querySelector('#buttonManagementPanel__intitutions')
        fireEvent.click(institution);
        //expect()
        
    })
    
})