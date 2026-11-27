import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { Button, PopoverProvider, TooltipLinkList } from 'storybook/internal/components'
import { useTheme } from 'storybook/theming'
import { version as currentVersion } from '../../../package.json'
import { MAINTAINED_DOC_URL, archiveUrl, getOtherVersions, isArchivedDoc, loadArchivedVersions } from './versions'

const ADDON_ID = 'synapse-versions'

type ArchivesState = { status: 'loading' } | { status: 'error' } | { status: 'ready', versions: string[] }

// Chargé une seule fois, dès l'enregistrement de l'addon
let archivesRequest: Promise<string[] | null> | undefined

const useArchivedVersions = (): ArchivesState => {
	const [state, setState] = React.useState<ArchivesState>({ status: 'loading' })

	React.useEffect(() => {
		let active = true
		archivesRequest ??= loadArchivedVersions()
		archivesRequest.then((versions) => {
			if (active) {
				setState(versions ? { status: 'ready', versions } : { status: 'error' })
			}
		})
		return () => {
			active = false
		}
	}, [])

	return state
}

const textStyle = { margin: '8px 12px', fontSize: 12, lineHeight: 1.5 }

// Nouvel onglet : la doc consultée reste ouverte.
// Le nom accessible reprend le texte visible et signale l'ouverture (RGAA 13.2).
const newTabLink = (label: string, href: string) => ({
	'href': href,
	'target': '_blank',
	'rel': 'noopener noreferrer',
	'aria-label': `${label} (nouvel onglet)`,
})

const VersionsPopover = () => {
	const theme = useTheme()
	const archives = useArchivedVersions()
	const versions = archives.status === 'ready' ? archives.versions : []
	const isArchive = isArchivedDoc(currentVersion, versions)
	const links = getOtherVersions(currentVersion, versions).map(version => ({
		id: version,
		title: `v${version}`,
		...newTabLink(`v${version}`, archiveUrl(version)),
	}))

	return React.createElement(
		'div',
		// Fond opaque : celui du popover Storybook laisse voir la page en dessous
		{ style: { maxWidth: 280, background: theme.barBg, borderRadius: 'inherit' } },
		isArchive
			? React.createElement(
					'p',
					{ style: textStyle },
					`Vous consultez la documentation archivée de la version ${currentVersion}. Pour un projet en cours de développement, utilisez la `,
					// Même onglet : on quitte l'archive pour la doc maintenue
					React.createElement('a', { href: MAINTAINED_DOC_URL }, 'version maintenue'),
					'.',
				)
			: React.createElement(
					'p',
					{ style: textStyle },
					`Vous consultez la version ${currentVersion}, celle que nous maintenons. Pour un projet en cours de développement, utilisez-la.`,
				),
		archives.status === 'loading' && React.createElement('p', { style: textStyle }, 'Chargement des versions archivées…'),
		archives.status === 'error' && React.createElement('p', { style: textStyle }, 'La liste des versions archivées est indisponible pour le moment.'),
		links.length > 0 && React.createElement(
			'p',
			{ style: { ...textStyle, margin: '8px 12px 0', fontWeight: 700 } },
			isArchive ? 'Autres versions archivées' : 'Versions archivées',
			React.createElement(
				'span',
				{ style: { display: 'block', fontWeight: 400 } },
				'S\'ouvrent dans un nouvel onglet',
			),
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
	archivesRequest ??= loadArchivedVersions()

	addons.register(ADDON_ID, () => {
		addons.add(`${ADDON_ID}/tool`, {
			type: types.TOOL,
			title: 'Versions de la documentation',
			render: () => React.createElement(VersionsTool),
		})
	})
}
