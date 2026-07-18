import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, ref } from 'vue'
import SelectBtnField from './SelectBtnField.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta = {
	title: 'Composants/Formulaires/Selects/SelectBtnField',
	component: SelectBtnField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		...getValidationDocumentation('base'),
		locales: {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (messages de validation). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	requiredField: (label: string) => string,
}` },
				category: 'props',
			},
		},
		modelValue: {
			control: { SelectBtnField },
			default: null,
		},
		items: {
			control: { Array },
			default: [],
			description: 'Liste des éléments sélectionnables',
			table: {
				type: { summary: 'SelectBtnItem[]' },
			},
		},
		label: {
			description: 'Valeur utilisée pour l’attribut aria-label, préfèrer l’utilisation de aria-labelledby pour respecter les impératifs d’accessibilité',
			control: { type: 'text' },
			default: undefined,
		},
		ariaLabelledby: {
			description: 'Identifiant (id) de l’élément qui étiquette ce champ',
			control: { type: 'text' },
			default: undefined,
		},
		multiple: {
			control: { type: 'boolean' },
			default: false,
		},
		inline: {
			control: { type: 'boolean' },
			default: false,
		},
		helpText: {
			description: 'Texte d’aide permanent affiché sous le champ.',
			control: { type: 'text' },
			default: undefined,
		},
	},
} satisfies Meta<typeof SelectBtnField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method">Choisissez votre moyen de contact :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref([])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		multiple: false,
		inline: false,
		readonly: false,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
                    <SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						:label="args.label"
						:multiple="args.multiple"
						:inline="args.inline"
						:help-text="args.helpText"
						:readonly="args.readonly"
						aria-labelledby="contact-method"
					/>
				</div>
            `,
		}
	},
}

export const Required: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Champ requis : la validation `required` se déclenche à la soumission (`validateOnSubmit`).',
			},
		},
		sourceCode: [
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref(null)
const fieldRef = ref(null)

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		label: 'Moyen de contact',
		required: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
				onMounted(() => {
					fieldRef.value?.validateOnSubmit()
				})
				return { args, fieldRef }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						ref="fieldRef"
						v-model="args.modelValue"
						:items="args.items"
						label="Moyen de contact"
						aria-labelledby="contact-method"
						required
					/>
				</div>
			`,
		}
	},
}

export const Multiple: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
	   <SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			multiple
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref([])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		multiple: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<SelectBtnField
					v-model="args.modelValue"
					:items="args.items"
					:multiple="args.multiple"
					aria-labelledby="contact-method"
				/>
			</div>
            `,
		}
	},
}

export const inline: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6" >Choisissez votre moyen de contact :</h2>
	   <SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			inline
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref([])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		inline: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						:inline="args.inline"
						aria-labelledby="contact-method"
					/>
				</div>
            `,
		}
	},
}

export const itemUnique: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
	   <SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			multiple
		/>
	</div>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref([])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
        { text: 'Autre', value: 'other', unique: true },
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
			{ text: 'Autre', value: 'other', unique: true },
		],
		multiple: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						:multiple="args.multiple"
						aria-labelledby="contact-method"
					/>
				</div>
                <p class="text-caption" style="margin-top: 20px;">
                  Les items marqués avec <code>unique: true</code> sont exclusifs&nbsp;: lorsqu’ils sont sélectionnés,
                  tous les autres items sont automatiquement désélectionnés.
                </p>
            `,
		}
	},
}

export const HelpText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
	   <SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			help-text="Par défaut, le moyen de contact est l’email."
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref([])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		helpText: 'Par défaut, le moyen de contact est l’email.',
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						aria-labelledby="contact-method"
						:help-text="args.helpText"
					/>
				</div>
            `,
		}
	},
}

export const readonly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			readonly
		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
    import { SelectBtnField } from '@cnamts/synapse'
    import { ref } from 'vue'

	const value = ref(['email'])
	const items = [
		{ text: 'Email', value: 'email' },
		{ text: 'Courrier', value: 'courrier' },
		{ text: 'SMS', value: 'sms' },
	]
</script>
				`,
			},
		],
	},
	args: {
		modelValue: ['email'],
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		label: 'Moyen de contact',
		readonly: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField },
			setup() {
				return { args }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="args.modelValue"
						:items="args.items"
						aria-labelledby="contact-method"
						:readonly="args.readonly"
					/>
				</div>
			`,
		}
	},
}
