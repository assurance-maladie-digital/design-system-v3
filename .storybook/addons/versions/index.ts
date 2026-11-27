import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { Button, PopoverProvider, TooltipLinkList } from 'storybook/internal/components'
import { version as currentVersion } from '../../../package.json'
import { getArchivedVersions } from './versions'

const ADDON_ID = 'synapse-versions'

const VersionsPopover = () => {
	const links = getArchivedVersions(currentVersion).map(({ version, url }) => ({
		id: version,
		title: `v${version}`,
		href: url,
	}))

	return React.createElement(
		'div',
		{ style: { maxWidth: 280 } },
		React.createElement(
			'p',
			{ style: { margin: '8px 12px', fontSize: 12, lineHeight: 1.5 } },
			`Vous consultez la version ${currentVersion}, celle que nous maintenons. Pour un projet en cours de développement, utilisez-la.`,
		),
		links.length > 0 && React.createElement(
			'p',
			{ style: { margin: '8px 12px 0', fontSize: 12, fontWeight: 700 } },
			'Versions archivées',
		),
		links.length > 0 && React.createElement(TooltipLinkList, { links }),
	)
}

const VersionsTool = () =>
	React.createElement(
		PopoverProvider,
		{
			ariaLabel: 'Versions de la documentation',
			placement: 'bottom-start',
			padding: 0,
			popover: React.createElement(VersionsPopover),
		},
		React.createElement(
			Button,
			{
				variant: 'ghost',
				padding: 'small',
				// Le texte visible suffit comme nom accessible
				ariaLabel: false,
				disableAllTooltips: true,
			},
			`Version ${currentVersion}`,
		),
	)

export const registerVersionsAddon = () => {
	addons.register(ADDON_ID, () => {
		addons.add(`${ADDON_ID}/tool`, {
			type: types.TOOL,
			title: 'Versions de la documentation',
			render: () => React.createElement(VersionsTool),
		})
	})
}
