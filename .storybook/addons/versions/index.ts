import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { Button, PopoverProvider, TooltipLinkList } from 'storybook/internal/components'
import { useTheme } from 'storybook/theming'
import { version as currentVersion } from '../../../package.json'
import { type DocVersion, fallbackDocVersions, getArchivedVersions, loadDocVersions } from './versions'

const ADDON_ID = 'synapse-versions'

// Chargé une seule fois, dès l'enregistrement de l'addon
let docVersionsRequest: Promise<DocVersion[]> | undefined

const useDocVersions = () => {
	const [versions, setVersions] = React.useState(fallbackDocVersions)

	React.useEffect(() => {
		let active = true
		docVersionsRequest ??= loadDocVersions()
		docVersionsRequest.then((loaded) => {
			if (active) {
				setVersions(loaded)
			}
		})
		return () => {
			active = false
		}
	}, [])

	return versions
}

const VersionsPopover = () => {
	const theme = useTheme()
	const links = getArchivedVersions(currentVersion, useDocVersions()).map(({ version, url }) => ({
		id: version,
		title: `v${version}`,
		href: url,
	}))

	return React.createElement(
		'div',
		// Fond opaque : celui du popover Storybook laisse voir la page en dessous
		{ style: { maxWidth: 280, background: theme.barBg, borderRadius: 'inherit' } },
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
		links.length > 0 && React.createElement(
			'div',
			// Liste longue : elle défile, la barre de défilement signale la suite
			{ style: { maxHeight: 'min(60vh, 360px)', overflowY: 'auto' } },
			React.createElement(TooltipLinkList, { links }),
		),
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
	docVersionsRequest ??= loadDocVersions()

	addons.register(ADDON_ID, () => {
		addons.add(`${ADDON_ID}/tool`, {
			type: types.TOOL,
			title: 'Versions de la documentation',
			render: () => React.createElement(VersionsTool),
		})
	})
}
