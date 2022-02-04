import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import Resources from './resources'
describe('Management panel', () => {
	test('Search Bar display', () => {
		const component = render(<Resources />);
		const resourcesSearchBarIcon = component.container.querySelector("#resourcesSearchBarIcon")
		expect(resourcesSearchBarIcon).toHaveStyle('display:block');
	})
	test('check input in focus', () => {
		const component = render(<Resources />);
		const resourcesSearchBar = component.container.querySelector('#resourcesSearchBarInput')
		act(() => resourcesSearchBar.focus());
		expect(resourcesSearchBar).toHaveFocus();

	})

});