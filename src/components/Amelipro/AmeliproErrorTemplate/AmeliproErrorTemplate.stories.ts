import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproErrorTemplate from './AmeliproErrorTemplate.vue'

const meta = {
	argTypes: {
		btnHref: { description: 'Href du bouton situé sous le texte principal si le slot "button est inutilisé"' },
		btnTo: { description: 'Route du bouton situé sous le texte principal si le slot "button est inutilisé"' },
		button: { description: 'Bouton sous le texte principal' },
		click: { description: 'Événement émis au clic sur le bouton', type: 'void' },
		contentTitle: { description: 'Titre du contenu' },
		customBtnText: { description: 'Texte du bouton' },
		customContentText: { description: 'Texte principal' },
		customContentTitle: { description: 'Titre sous l’image ' },
		customImgUrl: { description: 'Lien de l’image' },
		customTitleText: { description: 'Titre de la card' },
		default: { description: 'Texte principal' },
		errorType: {
			control: 'select',
			description: 'Active les Modes par défaut',
			options: [
				'disconnect',
				'obsolete',
				'inactive',
				'technical',
				'maintenance',
				'error401',
				'error403',
				'error404',
				'error500',
				'error503',
			],
			table: { type: { summary: 'string' } },
		},
		image: { description: 'Image de la fenetre' },
		imgMinWidth: { description: 'Taille de minimal de l’image' },
		imgWidth: { description: 'Taille de l’image' },
		noButton: { description: 'Booléen permettant d’activer supprimer le bouton en bas du message' },
		title: { description: 'Titre de la fenêtre' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproErrorTemplate,
	title: 'Composants/Amelipro/Mise en page/AmeliproErrorTemplate',
} as Meta<typeof AmeliproErrorTemplate>
export default meta

type Story = StoryObj<typeof AmeliproErrorTemplate>

export const Default: Story = {
	args: {
		errorType: 'technical',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproErrorTemplate
    error-type="technical"
    img-min-width="200"
    img-width="200"
    :no-button="false"
  />
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur technique par défaut.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Disconnect: Story = {
	args: {
		errorType: 'disconnect',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="disconnect"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur de déconnexion (<code>disconnect</code>).</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Obsolete: Story = {
	args: {
		errorType: 'obsolete',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="obsolete"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur obsolète (<code>obsolete</code>).</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Inactive: Story = {
	args: {
		errorType: 'inactive',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="inactive"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur inactive (<code>inactive</code>).</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Maintenance: Story = {
	args: {
		errorType: 'maintenance',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="maintenance"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur de maintenance (<code>maintenance</code>).</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Error401: Story = {
	args: {
		errorType: 'error401',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="error401"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur 401.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Error403: Story = {
	args: {
		errorType: 'error403',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="error403"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur 403.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Error404: Story = {
	args: {
		errorType: 'error404',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="error404"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur 404.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Error500: Story = {
	args: {
		errorType: 'error500',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="error500"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur 500.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}

export const Error503: Story = {
	args: {
		errorType: 'error503',
		imgMinWidth: '200',
		imgWidth: '200',
		noButton: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproErrorTemplate
		error-type="error503"
		img-min-width="200"
		img-width="200"
		:no-button="false"
	/>
</template>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproErrorTemplate },
		setup() {
			return { args }
		},
		template: `
<p class="mb-2">Affichage du template d’erreur 503.</p>
<AmeliproErrorTemplate v-bind="args" />
		`,
	}),
}
