import React from 'react'
import type { API_HashEntry } from 'storybook/internal/types'
import {
	mdiBookOpenPageVariantOutline,
	mdiFlaskOutline,
	mdiHumanHandsup,
	mdiLeaf,
	mdiPaletteOutline,
	mdiPuzzleOutline,
	mdiRocketLaunchOutline,
	mdiViewDashboardOutline,
} from '@mdi/js'

// Icône devant chaque rubrique de premier niveau du menu, pour les distinguer d'un coup d'œil.
const ROOT_ICONS: Record<string, string> = {
	'Démarrer': mdiRocketLaunchOutline,
	'Accessibilité': mdiHumanHandsup,
	'Éco-conception': mdiLeaf,
	'Design Tokens': mdiPaletteOutline,
	'Composants': mdiPuzzleOutline,
	'Labs': mdiFlaskOutline,
	'Templates': mdiViewDashboardOutline,
	'Guide Du Dev': mdiBookOpenPageVariantOutline,
}

export const renderSidebarLabel = (item: API_HashEntry) => {
	const icon = item.type === 'root' ? ROOT_ICONS[item.name] : undefined
	if (!icon) return item.name

	return React.createElement(
		'span',
		{ style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
		// Décorative : le nom de la rubrique suit
		React.createElement(
			'svg',
			{ 'viewBox': '0 0 24 24', 'width': 16, 'height': 16, 'aria-hidden': true, 'focusable': false },
			React.createElement('path', { d: icon, fill: 'currentColor' }),
		),
		item.name,
	)
}
