import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCheckbox from './AmeliproCheckbox.vue'

const meta = {
	argTypes: {
		'append': { description: 'Permet de rajouter un élément après le label' },
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire' },
		'checkbox': {
			description: 'Objet qui permet de générer la checkbox',
			table: {
				type: {
					detail: `{
						label: string;
						value: string;
						description?: string;
					}`,
					summary: 'AmeliproCheckboxItem',
				},
			},
		},
		'disabled': { description: 'Permet de désactiver la checkbox' },
		'errorDefault': { description: 'Peut afficher la checkbox en erreur directement au chargement' },
		'isSwitch': { description: 'Transforme la checkbox en switch' },
		'label': { description: 'Permet de renseigner un label personnalisé' },
		'labelLeft': { description: 'Positionne le label à gauche de la case à cocher' },
		'modelValue': { description: 'Etat de la checkbox' },
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props ariaRequired est active' },
		'uniqueId': { description: 'Id unique de la checkbox' },
		'update:model-value': { description: 'Événement émit au changement de la valeur de la checkbox' },
	},
	component: AmeliproCheckbox,
	title: 'Composants/Amelipro/Formulaires/AmeliproCheckbox',
} as Meta<typeof AmeliproCheckbox>

export default meta

type Story = StoryObj<typeof AmeliproCheckbox>

export const Default: Story = {
	args: {
		checkbox: {
			label: 'Exemple',
			value: 'Valeur de la checkbox',
		},
		uniqueId: 'checkbox-example',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-example"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { AmeliproCheckbox } from '@cnamts/synapse'

	const isChecked = ref(false)
	const checkbox = {
		description: 'ma-tooltip',
		label: 'Exemple',
		value: 'Valeur de la checkbox',
	}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref<boolean | undefined>(false)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproCheckbox
	:checkbox="args.checkbox"
	:unique-id="args.id"
	v-bind="args"
	v-model="model"
>
	<template #append>
		<AmeliproTooltips
			class="ml-2"
			tooltip-text="contenu de la tooltip"
			unique-id="ma-tooltip"
		/>
	</template>
</AmeliproCheckbox>`,
	}),
}
