import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ConformitePanel } from './conformitePanel'
import { isConformiteHidden } from './isConformiteHidden'

export const registerConformiteAddon = () => {
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
