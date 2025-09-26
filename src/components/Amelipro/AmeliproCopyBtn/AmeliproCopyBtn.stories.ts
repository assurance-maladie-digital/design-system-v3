import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCopyBtn from './AmeliproCopyBtn.vue'
import AmeliproTextArea from '../AmeliproTextArea/AmeliproTextArea.vue'

const meta = {
	argTypes: {
		textToCopy: { description: 'Le texte à copier au clic sur le bouton.' },
		uniqueId: { description: 'Identifiant unique du bouton.' },
	},
	component: AmeliproCopyBtn,
	title: 'Composants/Amelipro/AmeliproCopyBtn',
} as Meta<typeof AmeliproCopyBtn>

export default meta

type Story = StoryObj<typeof AmeliproCopyBtn>

export const Default: Story = {
	args: {
		textToCopy: 'texte à copier',
		uniqueId: 'my-btn-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<AmeliproCopyBtn
	text-to-copy="texte à copier"
	unique-id="my-btn-id"
>
	Copier
</AmeliproCopyBtn>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproCopyBtn } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCopyBtn, AmeliproTextArea },
		setup() {
			return { args }
		},
		template: `
	<p>
		Cliquer sur le bouton pour copier le texte dans le presse-papier.
	</p>
	<AmeliproCopyBtn v-bind="args" style="margin-left: 200px;">
		Copier
	</AmeliproCopyBtn>
	<AmeliproTextArea style="width: 100%; height: 100px; margin-top: 1rem;" placeholder="Vous pouvez coller ici le texte copié pour vérifier que cela a bien fonctionné." />
		`,
	}),
}

export const AvecTexteLong: Story = {
	name: 'Texte à copier long',
	args: {
		textToCopy: 'Ceci est un texte très long à copier pour tester le comportement du bouton et du message de validation.',
		uniqueId: 'copy-btn-long',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Le bouton copie un texte long dans le presse-papier et affiche un message de validation.</p>
    <AmeliproCopyBtn
        text-to-copy="Ceci est un texte très long à copier pour tester le comportement du bouton et du message de validation."
        unique-id="copy-btn-long"
    >
        Copier
    </AmeliproCopyBtn>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproCopyBtn } from '@cnamts/synapse'
</script>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproCopyBtn, AmeliproTextArea },
		setup() { return { args } },
		template: `
<p class="mb-2">Le bouton copie un texte long dans le presse-papier et affiche un message de validation.</p>
<AmeliproCopyBtn v-bind="args" style="margin-left: 200px;">
    Copier
</AmeliproCopyBtn>
<AmeliproTextArea style="width: 100%; height: 100px; margin-top: 1rem;" placeholder="Vous pouvez coller ici le texte copié pour vérifier que cela a bien fonctionné." />
        `,
	}),
}

export const AvecGestionClick: Story = {
	name: 'Gestion de l’événement click',
	args: {
		textToCopy: 'Texte à copier avec gestion d’événement',
		uniqueId: 'copy-btn-click',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Le bouton émet un événement <code>click</code> lors de la copie.</p>
    <AmeliproCopyBtn
        text-to-copy="Texte à copier avec gestion d’événement"
        unique-id="copy-btn-click"
        @click="onCopyClick"
    >
        Copier avec gestion
    </AmeliproCopyBtn>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproCopyBtn } from '@cnamts/synapse'

function onCopyClick(id: string) {
    alert('Événement click émis par : ' + id)
}
</script>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproCopyBtn, AmeliproTextArea },
		setup() {
			function onCopyClick(id: string) {
				alert('Événement click émis par : ' + id)
			}
			return { args, onCopyClick }
		},
		template: `
<p class="mb-2">Le bouton émet un événement <code>click</code> lors de la copie.</p>
<AmeliproCopyBtn v-bind="args" @click="onCopyClick" style="margin-left: 200px;">
    Copier avec gestion
</AmeliproCopyBtn>
<AmeliproTextArea style="width: 100%; height: 100px; margin-top: 1rem;" placeholder="Vous pouvez coller ici le texte copié pour vérifier que cela a bien fonctionné." />
        `,
	}),
}
