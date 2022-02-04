import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import MenuSettings from './MenuSettings';

describe('Menu Setting', () => {
	test('dark mode should change to lightmode:', () => {
		const component = render(<MenuSettings />);

		const lightmodebutton = component.container.querySelector('#lightmode');
		const darkmodebutton = component.container.querySelector('#darkmode');

		fireEvent.click(lightmodebutton);
		expect(lightmodebutton.classList.contains('activeMode')).toBe(true);
		expect(darkmodebutton.classList.contains('activeMode')).toBe(false);
	});
	test('light mode should change to darkmode:', () => {
		const component = render(<MenuSettings />);

		const lightmodebutton = component.container.querySelector('#lightmode');
		const darkmodebutton = component.container.querySelector('#darkmode');

		fireEvent.click(darkmodebutton);
		expect(darkmodebutton.classList.contains('activeMode')).toBe(true);
		expect(lightmodebutton.classList.contains('activeMode')).toBe(false);
	});
});
