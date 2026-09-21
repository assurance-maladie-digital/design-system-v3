import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ConformitePanel } from './conformitePanel'
import { isConformiteHidden } from './isConformiteHidden'

/**
 * Décision injectée par `managerHead` (voir .storybook/main.ts).
 * Meta absent = on affiche : seul le Storybook publié le passe à `false`.
 */
const isPanelEnabled = () =>
	document
		.querySelector('meta[name="synapse-conformite"]')
		?.getAttribute('content') !== 'false'

export const registerConformiteAddon = () => {
	if (!isPanelEnabled()) return

	addons.register(
		'conformite-design-system',
		(api) => {
			addons.add(
				'conformite-design-system/panel',
				{
					type: types.PANEL,
					title: 'Conformité',
					disabled: () => isConformiteHidden(api.getCurrentStoryData()?.title),
					render: ({ active }) =>
						React.createElement(
							ConformitePanel,
							{
								active: Boolean(active),
							},
						),
				},
			)
		},
	)
}
