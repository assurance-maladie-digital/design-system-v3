import React from 'react'
import { addons, useChannel } from 'storybook/manager-api'
import { AddonPanel } from 'storybook/internal/components'
import type {
	ConformitePanelProps,
	StatutResult,
} from './types'

const channel = addons.getChannel()

export const ConformitePanel = ({
	active,
}: ConformitePanelProps) => {
	const [result, setResult]
		= React.useState<StatutResult | null>(null)

	useChannel({
		'conformite-design-system/result': (
			data: StatutResult,
		) => {
			setResult(data)
		},
	})

	React.useEffect(() => {
		if (active) {
			channel.emit(
				'conformite-design-system/request',
			)
		}
	}, [active])

	if (!result) {
		return React.createElement(
			AddonPanel,
			{
				active: Boolean(active),
				children: React.createElement(
					'div',
					{ style: { padding: 16 } },
					'Aucune donnée de conformité disponible.',
				),
			},
		)
	}

	const isFormComponent
		= result.componentCategory
			.toLowerCase()
			.includes('formulaires')

	const hasVisualTheme
		= ['HeaderBar', 'FooterBar']
			.includes(result.component)

	const headers = [
		'Composant',
		'Props / Slots documentés',
		'Onglet Source Code',
		...(isFormComponent
			? ['Stories manquantes']
			: []),
		'Page usages UX',
		...(hasVisualTheme
			? ['Thème visuel']
			: []),
		'Playground interactif',
		'Criticité',
	]

	const values = [
		result.component,
		result.doc,
		result.sourceCode,
		...(isFormComponent
			? [result.requiredStories || '-']
			: []),
		result.usagePage,
		...(hasVisualTheme
			? [result.visualTheme || '-']
			: []),
		result.playground,
		result.criticality,
	]

	return React.createElement(
		AddonPanel,
		{
			active: Boolean(active),
			children: React.createElement(
				'div',
				{
					style: {
						padding: 16,
						overflow: 'auto',
					},
				},
				React.createElement(
					'h3',
					{ style: { marginBottom: 16 } },
					`${result.component} - ${result.story}`,
				),
				React.createElement(
					'table',
					{
						style: {
							width: '100%',
							borderCollapse: 'collapse',
						},
					},
					React.createElement(
						'thead',
						null,
						React.createElement(
							'tr',
							null,
							...headers.map(label =>
								React.createElement(
									'th',
									{
										key: label,
										style: {
											textAlign: 'left',
											padding: 8,
											borderBottom: '1px solid #ddd',
											verticalAlign: 'top',
										},
									},
									label,
								),
							),
						),
					),
					React.createElement(
						'tbody',
						null,
						React.createElement(
							'tr',
							null,
							...values.map((value, index) =>
								React.createElement(
									'td',
									{
										key: `${headers[index]}-${index}`,
										style: {
											padding: 8,
											verticalAlign: 'top',
										},
									},
									value || '-',
								),
							),
						),
					),
				),
			),
		},
	)
}
