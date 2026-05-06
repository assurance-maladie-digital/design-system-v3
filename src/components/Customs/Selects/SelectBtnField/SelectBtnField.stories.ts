import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from './SelectBtnField.vue'
import { ref } from 'vue'

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
		modelValue: {
			control: { SelectBtnField },
			default: null,
		},
		items: {
			control: { Array },
			default: [],
			description: 'Liste des Ã©lÃ©ments sÃ©lectionnables',
			table: {
				type: { summary: 'SelectBtnItem[]' },
			},
		},
		label: {
			description: 'Valeur utilisÃ©e pour lâ€™attribut aria-label, prÃ©fÃ¨rer lâ€™utilisation de aria-labelledby pour respecter les impÃ©ratifs dâ€™accessibilitÃ©',
			control: { type: 'text' },
			default: undefined,
		},
		ariaLabelledby: {
			description: 'Identifiant (id) de lâ€™Ã©lÃ©ment qui Ã©tiquette ce champ',
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
		hint: {
			control: { type: 'text' },
			default: undefined,
		},
		hasError: {
			control: { type: 'boolean' },
			default: false,
		},
		errorMessages: {
			control: { type: 'text' },
			default: undefined,
		},
		readonly: {
			control: { type: 'boolean' },
			default: false,
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
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
    
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		multiple: false,
		inline: false,
		hint: undefined,
		hasError: false,
		errorMessages: undefined,
		readonly: false,
		showSuccessMessages: false,
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
						:hint="args.hint"
						:hasError="args.hasError"
						:error-messages="args.errorMessages"
						:readonly="args.readonly"
						:showSuccessMessages="args.showSuccessMessages"
						aria-labelledby="contact-method"
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
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
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
					:showSuccessMessages="false"

					aria-labelledby="contact-method"
				/>
			</div>
            `,
		}
	},
}

export const Inline: Story = {
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
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
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
						:showSuccessMessages="false"
						:inline="args.inline"
						aria-labelledby="contact-method"
					/>
				</div>
            `,
		}
	},
}

export const ItemUnique: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
	   <SelectBtnField
			v-model="args.modelValue"
			:items="args.items"
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
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
        {
			text: 'Autre',
			value: 'other',
			unique: true
		}
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
			{
				text: 'Autre',
				value: 'other',
				unique: true,
			},
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

export const MessageAide: Story = {
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
			hint="Par defaut, le moyen de contact est l’email."
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
		{
			text: 'Email',
			value: 'email',
		},
		{
			text: 'Courrier',
			value: 'courrier',
		},
		{
			text: 'SMS',
			value: 'sms',
		},
	]
</script>
                `,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{
				text: 'Email',
				value: 'email',
			},
			{
				text: 'Courrier',
				value: 'courrier',
			},
			{
				text: 'SMS',
				value: 'sms',
			},
		],
		hint: 'Par dÃ©faut, le moyen de contact est lâ€™email.',
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
						:hint="args.hint"
					/>
				</div>
            `,
		}
	},
}


