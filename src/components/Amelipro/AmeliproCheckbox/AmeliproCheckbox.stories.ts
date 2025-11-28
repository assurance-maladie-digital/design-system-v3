import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCheckbox from './AmeliproCheckbox.vue'

const meta = {
	argTypes: {
		'append': { description: 'Permet de rajouter un élément après le label' },
		'required': { description: 'Permet de rendre la selection obligatoire' },
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
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props required est active' },
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
				name: 'Script',
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
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproCheckbox
	v-bind="args"
	v-model="model"
>
	<template #append>
		<AmeliproTooltips
			classes="ml-2"
			tooltip-text="contenu de la tooltip"
			unique-id="ma-tooltip"
		/>
	</template>
</AmeliproCheckbox>`,
	}),
}

export const Disabled: Story = {
	args: {
		checkbox: {
			label: 'Désactivée',
			value: 'disabled',
		},
		uniqueId: 'checkbox-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Exemple de case à cocher désactivée grâce à la prop <code>disabled</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-disabled"
		disabled
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Exemple de case à cocher désactivée grâce à la prop <code>disabled</code>.</p>
<AmeliproCheckbox
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Switch: Story = {
	args: {
		checkbox: {
			label: 'Switch',
			value: 'switch',
		},
		uniqueId: 'checkbox-switch',
		isSwitch: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La checkbox est affichée sous forme de switch grâce à la prop <code>isSwitch</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-switch"
		is-switch
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La checkbox est affichée sous forme de switch grâce à la prop <code>isSwitch</code>.</p>
<AmeliproCheckbox v-bind="args" v-model="model" />`,
	}),
}

export const LabelLeft: Story = {
	args: {
		checkbox: {
			label: 'Label à gauche',
			value: 'label-left',
		},
		uniqueId: 'checkbox-label-left',
		labelLeft: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le label est positionné à gauche grâce à la prop <code>labelLeft</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-label-left"
		label-left
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le label est positionné à gauche grâce à la prop <code>labelLeft</code>.</p>
<AmeliproCheckbox v-bind="args" v-model="model" />`,
	}),
}

export const Required: Story = {
	args: {
		checkbox: {
			label: 'Obligatoire',
			value: 'required',
		},
		uniqueId: 'checkbox-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La sélection est obligatoire grâce à la prop <code>required</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-required"
		required
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La sélection est obligatoire grâce à la prop <code>required</code>.</p>
<AmeliproCheckbox v-bind="args" v-model="model" />`,
	}),
}

export const ErrorDefault: Story = {
	args: {
		checkbox: {
			label: 'Erreur au chargement',
			value: 'error-default',
		},
		uniqueId: 'checkbox-error-default',
		required: true,
		errorDefault: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La checkbox affiche une erreur dès le chargement grâce à la prop <code>errorDefault</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-error-default"
		required
		error-default
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La checkbox affiche une erreur dès le chargement grâce à la prop <code>errorDefault</code>.</p>
<AmeliproCheckbox v-bind="args" v-model="model" />`,
	}),
}

export const CustomErrorMessage: Story = {
	args: {
		checkbox: {
			label: 'Erreur personnalisée',
			value: 'custom-error',
		},
		uniqueId: 'checkbox-custom-error',
		required: true,
		requiredErrorMessage: 'Veuillez cocher cette case pour continuer',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Message d’erreur personnalisé via la prop <code>requiredErrorMessage</code>.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-custom-error"
		required
		required-error-message="Veuillez cocher cette case pour continuer"
	/>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Message d’erreur personnalisé via la prop <code>requiredErrorMessage</code>.</p>
<AmeliproCheckbox v-bind="args" v-model="model" />`,
	}),
}

export const Append: Story = {
	args: {
		checkbox: {
			label: 'Avec append',
			value: 'with-append',
		},
		uniqueId: 'checkbox-with-append',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Exemple avec slot append.</p>
	<AmeliproCheckbox
		v-model="isChecked"
		:checkbox="checkbox"
		unique-id="checkbox-with-append"
	>
		<template #append>
			<span>Texte supplémentaire</span>
		</template>
	</AmeliproCheckbox>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckbox },
		setup() {
			const model = ref(false)
			watch(() => args.modelValue, (newValue) => {
				model.value = !!newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Exemple avec slot append.</p>
<AmeliproCheckbox v-bind="args" v-model="model">
	<template #append>
		<span>Texte supplémentaire</span>
	</template>
</AmeliproCheckbox>`,
	}),
}
