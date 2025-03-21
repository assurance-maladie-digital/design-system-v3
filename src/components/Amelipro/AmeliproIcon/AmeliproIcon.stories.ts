import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproIcon from './AmeliproIcon.vue'
import { iconList } from './iconList'

const meta = {
	argTypes: {
		borderColor: { description: 'Couleur de bordure de l’icône' },
		bordered: { description: 'Bordure autour de l’icône' },
		default: { description: 'Pour utiliser une icône material design utilisez les noms de classe `mdi-icon`' },
		icon: { description: 'Le nom de l’icône personnalisé' },
		iconBgColor: { description: 'Couleur de l’arrière plan de l’icône' },
		iconColor: { description: 'Couleur de l’icône' },
		label: { description: 'Permet d’ajouter un nom accessible qui ne sera visible que par les technologies d’assistance' },
		large: { description: 'Pour avoir une icône de grande taille' },
		mdiPadding: { description: 'padding personnalisé lorsque vous utilisez une icône provenant de mdi' },
		medium: { description: 'Pour avoir une icône de taille moyenne' },
		size: { description: 'Défini la hauteur et la largeur de l’icône' },
		small: { description: 'Pour avoir une icône de petite taille' },
		uniqueId: { description: 'Identifiant unique du composant' },
		widthAuto: { description: 'Défini à `auto` la largeur de l’icône' },
		xLarge: { description: 'Pour avoir une icône de très grande taille' },
	},
	component: AmeliproIcon,
	title: 'Composants/AmeliproIcon',
} as Meta<typeof AmeliproIcon>
export default meta

type Story = StoryObj<typeof AmeliproIcon>

export const Default: Story = {
	args: {
		icon: 'utilisateur',
		iconBgColor: 'ap-blue-darken-1',
		iconColor: 'ap-white',
		uniqueId: 'amelipro-icon-id',
		xLarge: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIcon
		icon="utilisateur"
		icon-bg-color="ap-blue-darken-1"
		icon-color="ap-white"
		unique-id="amelipro-icon-id"
		x-large
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproIcon },
		setup() {
			return { args }
		},
		template: `
<AmeliproIcon
	v-bind="args"
/>
		`,
	}),

}

export const AllIcons: Story = {
	args: { iconColor: 'ap-white' },
	parameters: {},
	render: args => ({
		components: { AmeliproIcon },
		setup() {
			const icons = iconList
			return { args, icons }
		},
		template: `
<ul class="d-flex flex-wrap list-style-none">
	<li
		v-for="(icon, index) in icons"
		class="d-flex flex-column align-center"
		style="padding: 1rem; border: 1px solid #EEE; border-radius: 4px; margin: 8px; width: calc(20% - 16px);"
	>
		<AmeliproIcon
			v-bind="args"
			:icon="icon.name"
			:icon-bg-color="icon.noBackground ? 'transparent' : 'ap-blue-darken-1'"
			:icon-color="icon.noBackground ? 'ap-blue-darken-1' : args.iconColor"
			size="50px"
		/>
		<p class="mt-2"> {{ icon.name }} </p>
	</li>
</ul>`,
	}),
}
