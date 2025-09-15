import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCopyBtn from './AmeliproCopyBtn.vue'

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
		render: args => ({
			components: { AmeliproCopyBtn },
			setup() {
				return { args }
			},
			template: `
				<AmeliproCopyBtn
					v-bind="args"
				>
					{{ args.default }}
				</AmeliproCopyBtn>
			`,
		}),
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCopyBtn
		text-to-copy="texte à copier"
		unique-id="my-btn-id"
	>
		My Button
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
}
