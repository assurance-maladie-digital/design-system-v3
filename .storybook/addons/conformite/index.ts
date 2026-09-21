import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ConformitePanel } from './conformitePanel'
import { isConformiteHidden } from './isConformiteHidden'

/** Mode injecté par `managerHead` (voir .storybook/main.ts). */
const isDevManager = () =>
	document
		.querySelector('meta[name="synapse-env"]')
		?.getAttribute('content') === 'development'

export const registerConformiteAddon = () => {
	// Outil interne : absent du Storybook publié.
	if (!isDevManager()) return

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
