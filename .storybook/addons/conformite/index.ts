import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ConformitePanel } from './conformitePanel'

export const registerConformiteAddon = () => {
	addons.register(
		'conformite-design-system',
		(api) => {
			addons.add(
				'conformite-design-system/panel',
				{
					type: types.PANEL,
					title: 'Conformité',
					disabled: () => {
						const story = api.getCurrentStoryData()

						return story.title
							.split('/')
							.some(segment => segment.toLowerCase() === 'validation')
					},
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
