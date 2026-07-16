import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ConformitePanel } from './conformitePanel'

export const registerConformiteAddon = () => {
	addons.register(
		'conformite-design-system',
		() => {
			addons.add(
				'conformite-design-system/panel',
				{
					type: types.PANEL,
					title: 'Conformité',
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
