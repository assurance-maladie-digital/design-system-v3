import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { AddonPanel } from '@storybook/components'
import conformiteData from '../conformite-report.json'
import type { API } from 'storybook/manager-api'
import cnamTheme from './CnamTheme'
import paTheme from './PaTheme'
import apTheme from './ApTheme'
import ap2026Theme from './Ap2026Theme'

const channel = addons.getChannel()

type Theme = 'cnam' | 'pa' | 'ap' | 'ap2026'

const getCurrentTheme = (): Theme => {
	return (localStorage.getItem('storybook-theme') as Theme) ?? 'cnam'
}

const getThemeConfig = (theme: Theme) => {
	switch (theme) {
		case 'pa':
			return paTheme
		case 'ap':
			return apTheme
		case 'ap2026':
			return ap2026Theme
		default:
			return cnamTheme
	}
}

const applyThemeClass = (theme: Theme) => {
	document.documentElement.classList.remove(
		'theme-cnam',
		'theme-pa',
		'theme-ap',
		'theme-ap2026',
	)

	document.documentElement.classList.add(`theme-${theme}`)
}

const hiddenIdsByTheme: Record<Theme, string[]> = {
	cnam: [
		'composants-structure-footerbar--back-office',
		'composants-structure-footerbar--with-phone-number',
		'composants-boutons-usermenubtn--with-ps-info',
		'composants-données-accordion--with-custom-content',
		'composants-layout-pagecontainer--with-header-and-footer',
		'guide-du-dev-équivalence-des-composants-amelipro--docs',
	],

	pa: [
		'composants-structure',
		'composants-boutons-usermenubtn--with-ps-info',
		'composants-données-accordion--with-custom-content',
		'composants-layout-pagecontainer--with-header-and-footer',
	],

	ap: [
		'composants-données-logo',
		'composants-données-logobrandsection',
		'guide-du-dev-formulaires-validation',
		'guide-du-dev-migration',
		'composants-boutons-franceconnectbtn',
	],

	ap2026: [
		'guide-du-dev',
		'guide-du-dev-migration',
		'design-tokens-conteneurs-de-page',
		'design-tokens-couleurs--border-section',
		'design-tokens-couleurs--overlay-section',
		'design-tokens-couleurs--interaction-section',
		'design-tokens-couleurs--disabled-section',
		'design-tokens-couleurs--feedback-section',
		'design-tokens-couleurs-correspondances-couleurs--docs',
		'démarrer-créer-une-issue--creeruneissue',
		'design-tokens-arrondis',
		'design-tokens-elevations',
		'design-tokens-styles-typographiques',
		'composants-vue-d-ensemble--docs',
	],
}

const allowedEquivalenceIdsByTheme: Partial<Record<Theme, string[]>> = {
	ap: [
			'guide-du-dev-équivalence-des-composants-amelipro',
		],

	pa: [
		'guide-du-dev-équivalence-des-composants-portail-agent',
	],
}

const makeThemeFilter = (theme: Theme) => {
	return (item: { id?: string, name?: string }) => {
		const id = (item.id ?? '').toLowerCase()
		const name = (item.name ?? '').toLowerCase()

		const hiddenIds = hiddenIdsByTheme[theme] ?? []

		if (
			hiddenIds.some(hiddenId =>
				id.startsWith(hiddenId),
			)
		) {
			return false
		}

		if (id.startsWith('guide-du-dev-équivalence-des-composants')) {
			const allowedIds
				= allowedEquivalenceIdsByTheme[theme] ?? []

			return allowedIds.some(allowedId =>
				id.startsWith(allowedId),
			)
		}

		if (theme === 'ap2026') {
			if (id.startsWith('templates')) {
				return false
			}

			if (id.startsWith('composants-')) {
				return id.startsWith('composants-amelipro')
			}

			return true
		}

		const isAmeliorate
			= id.includes('amelipro')
				|| name.includes('amelipro')

		return !isAmeliorate
	}
}

const getCurrentItemIdFromUrl = () => {
	const params = new URLSearchParams(window.location.search)
	const path = params.get('path') ?? ''
	const match = path.match(/docs\/(.+)$/)
	return match?.[1] ?? null
}

const updateTheme = (api: API, themeValue?: string) => {
	const theme = (themeValue ?? 'cnam') as Theme

	applyThemeClass(theme)

	addons.setConfig({
		theme: getThemeConfig(theme),
	})

	api.experimental_setFilter(
		'theme',
		makeThemeFilter(theme),
	)

	const currentItemId = getCurrentItemIdFromUrl()

	if (currentItemId) {
		const isAllowed = makeThemeFilter(theme)({
			id: currentItemId,
		})

		if (!isAllowed) {
			api.selectStory('démarrer-accueil--docs')
		}
	}
}
addons.register(
	'theme-sidebar-filter',
	(api) => {
		updateTheme(
			api,
			getCurrentTheme(),
		)

		channel.on(
			'storybook-theme-change',
			(theme) => {
				updateTheme(api, theme)
			},
		)
	},
)

if (typeof window !== 'undefined') {
	const originalSetItem
		= localStorage.setItem

	localStorage.setItem = function (
		key,
		value,
	) {
		originalSetItem.call(
			this,
			key,
			value,
		)

		if (key === 'storybook-theme') {
			channel.emit(
				'storybook-theme-change',
				value,
			)
		}
	}

	window.addEventListener(
		'storage',
		(event) => {
			if (
				event.key === 'storybook-theme'
			) {
				channel.emit(
					'storybook-theme-change',
					event.newValue ?? 'cnam',
				)
			}
		},
	)
}

const ConformitePanel = ({ active }) => {
	const currentPath = new URLSearchParams(window.location.search).get('path') || ''
	const currentStoryId = currentPath.replace(/^\/story\//, '').replace(/^\/docs\//, '')

	const currentRows = conformiteData.filter(row =>
		currentStoryId.startsWith(row.storyPrefix),
	)

	return React.createElement(
		AddonPanel,
		{ active },
		React.createElement(
			'div',
			{ style: { padding: 16, overflow: 'auto' } },
			React.createElement(
				'table',
				{ style: { width: '100%', borderCollapse: 'collapse' } },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						['Component', 'Stories', 'Props', 'Doc', 'Issues auto', 'Score', 'Priorité']
							.map(label => React.createElement('th', {
								key: label,
								style: { textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' },
							}, label)),
					),
				),
				React.createElement(
					'tbody',
					null,
					currentRows.map(row => React.createElement(
						'tr',
						{ key: row.component },
						React.createElement('td', { style: { padding: 8 } }, row.component),
						React.createElement('td', { style: { padding: 8 } }, row.stories),
						React.createElement('td', { style: { padding: 8 } }, row.props),
						React.createElement('td', { style: { padding: 8 } }, row.doc),
						React.createElement('td', { style: { padding: 8 } }, row.issues?.join(', ')),
						React.createElement('td', { style: { padding: 8 } }, `${row.score}%`),
						React.createElement('td', { style: { padding: 8 } }, row.priority),
					)),
				),
			),
		),
	)
}

addons.register('conformite-design-system', () => {
	addons.add('conformite-design-system/panel', {
		type: types.PANEL,
		title: 'Conformité',
		render: ({ active }) => React.createElement(ConformitePanel, { active }),
	})
})
