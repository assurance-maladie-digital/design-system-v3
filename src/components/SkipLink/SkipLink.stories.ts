import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SkipLink from './SkipLink.vue'
import { computed } from 'vue'

const getMainTargetUrl = (): string => {
	if (typeof window === 'undefined') {
		return '#main'
	}

	try {
		const locationFromTop = window.top?.location
		const locationFromParent = window.parent?.location
		const loc = locationFromTop ?? locationFromParent ?? window.location
		return `${loc.origin}${loc.pathname}${loc.search}#main`
	}
	catch {
		return `${window.location.origin}${window.location.pathname}${window.location.search}#main`
	}
}

const meta = {
	title: 'Composants/Navigation/SkipLink',
	component: SkipLink,
	argTypes: {
		label: {
			description: 'Le libellé du lien d\'évitement. Prioritaire sur `locales.label`.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				defaultValue: {
					summary: 'locales.label',
					detail: '\'Aller au contenu principal\'',
				},
			},
		},
		target: {
			description: 'La cible du lien (sélecteur CSS ou ancre) lorsque le lien unique est utilisé.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				defaultValue: {
					summary: '\'#main\'',
				},
			},
		},
		skipLinks: {
			description: 'Liste de liens d\'évitement multiples. Chaque item contient un `label` et une `target`. Cette prop remplace le lien unique configuré avec `label` et `target`. A utiliser uniquement si plusieurs liens d\'évitement sont nécessaires.',
			control: 'object',
			table: {
				type: {
					summary: 'SkipLinkItem[]',
					detail: `{
	label: string,
	target: string,
}[]`,
				},
				defaultValue: {
					summary: '[]',
				},
			},
		},
		locales: {
			description: 'Surcharge des chaînes affichées à l\'utilisateur. Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: {
					summary: 'object',
					detail: `{
	label: string,
	ariaLabel: string,
}`,
				},
				category: 'props',
			},
		},
		default: {
			description: 'Slot par défaut : contenu personnalisé du lien (remplace le libellé).',
			control: { type: 'text' },
			table: {
				category: 'slots',
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof SkipLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-8">
		<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
		<SkipLink 
			label="Aller au contenu principal"
			target="#main" 
		/>
		<div id="main" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SkipLink } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		target: '',
	},
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				const resolvedTarget = computed(() => {
					return !args.target || args.target.includes('/iframe.html')
						? getMainTargetUrl()
						: args.target
				})

				return { args, resolvedTarget }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						:target="resolvedTarget"
						:label="args.label"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
					<div id="main" />
				</div>
			`,
		}
	},
}

export const WithSlot: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-8">
		<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
		<SkipLink target="#main">
			<template #default>
				<b>lorem ipsum</b>
			</template>
		</SkipLink>
		<div id="main" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SkipLink } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		target: '',
		default: '<b>lorem ipsum</b>',
	},
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				const resolvedTarget = computed(() => {
					return !args.target || args.target.includes('/iframe.html')
						? getMainTargetUrl()
						: args.target
				})

				return { args, resolvedTarget }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						v-bind="{ ...args, target: resolvedTarget }"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
					<div id="main" />
				</div>
			`,
		}
	},
}

export const MultipleLinks: Story = {
	args: {
		skipLinks: [
			{ label: 'Aller au contenu principal', target: '#main' },
			{ label: 'Aller au pied de page', target: '#footer' },
		],
	},
	render: args => ({
		components: { SkipLink },
		setup: () => ({ args }),
		template: `
			<div class="pa-8">
				<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
				<SkipLink :skip-links="args.skipLinks" />
				<div id="main" class="mb-16">Contenu principal</div>
				<footer id="footer">Pied de page</footer>
			</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-8">
		<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
		<SkipLink :skip-links="[
			{ label: 'Aller au contenu principal', target: '#main' },
			{ label: 'Aller au pied de page', target: '#footer' },
		]" />
		<div id="main" class="mb-16">Contenu principal</div>
		<footer id="footer">Pied de page</footer>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SkipLink } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
}
