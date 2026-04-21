import { baseContextualTokens } from '../baseContextualTokens'

export const apContextualTokens = {
	...baseContextualTokens,
	colors: {
		background: '#ffffff',
		border: '#dddddd',
		text: '#333333',
		icon: '#666666',
		overlay: 'rgba(0, 0, 0, 0.5)',
		interactive: '#007bff',
	},
	ap: {
		// Typography
		fontWeightRegular: '400',
		fontWeightBold: '700',
		fontSizeXxs: '0.75rem',
		fontSizeXs: '0.875rem',
		fontSizeSm: '1rem',
		fontSizeMd: '1.125rem',
		fontSizeLg: '1.25rem',
		fontSizeXl: '1.375rem',
		fontSizeXxl: '1.5rem',
		// Button
		btnRadius: '0.75rem',
		btnPaddingX: '1rem',
		btnPaddingY: '0.5rem',
		btnMinHeight: '2.5rem',
		// Card
		cardRadius: '0.75rem',
		cardPaddingDesktop: '1rem',
		cardPaddingTablet: '1rem',
		cardPaddingMobile: '0.75rem',
		// Dialog
		dialogPadding: '1.5rem',
		// Input / Form
		inputRadius: '0.5rem',
		inputMinHeight: '2.625rem',
		labelFontWeight: '700',
		// Filter pills
		filterRadius: '0.75rem',
		filterPaddingX: '2rem',
		filterPaddingY: '0.75rem',
		filterFontWeight: '700',
		// Tabs pills
		tabsPillRadius: '0.75rem',
		tabsPillPaddingX: '2rem',
		tabsPillPaddingY: '0.5rem',
		tabsPillFontWeight: '700',
		// Multiple folding card button
		multiFoldingBtnRadius: '0.75rem',
		multiFoldingBtnPaddingX: '2rem',
		multiFoldingBtnPaddingY: '0.5rem',
		multiFoldingBtnFontWeight: '700',
		// Switch
		switchTrackHeight: '2rem',
		switchTrackWidth: '3.5rem',
		switchTrackTop: '0',
		switchThumbHeight: '1.5rem',
		switchThumbWidth: '1.5rem',
		switchThumbTop: '0.25rem',
		switchThumbElevation: '0',
		switchWidth: '3.5rem',
		switchTrackOpacity: '1',
	},
}
