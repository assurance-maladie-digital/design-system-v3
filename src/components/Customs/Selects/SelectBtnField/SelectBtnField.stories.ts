import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from './SelectBtnField.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { VBtn } from 'vuetify/components'
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
		hint: {
			control: { type: 'text' },
			default: undefined,
		},
		error: {
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
		error: false,
		errorMessages: undefined,
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
						:hint="args.hint"
						:error="args.error"
						:error-messages="args.errorMessages"
						:readonly="args.readonly"
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

export const messageAide: Story = {
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
			hint="Par défaut, le moyen de contact est l’email."
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
		hint: 'Par défaut, le moyen de contact est l’email.',
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

export const erreur: Story = {
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
			v-model:error="error"
		/>
		<VBtn
			color="primary"
			class="mt-3"
			@click="resetExample"
		>
			Réinitialiser
		</VBtn>      
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
	const error = ref(true)
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
	function resetExample() {
		value.value = null
		error.value = true
	}
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
		error: true,
	},
	render: (args) => {
		return {
			components: { SelectBtnField, VBtn },
			setup() {
				const error = ref(args.error)
				const value = ref(args.modelValue)

				function resetExample() {
					error.value = true
					value.value = null
				}
				return { args, resetExample, error, value }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						v-model:error="error"
					/>
					<VBtn
						color="primary"
						class="mt-3"
						@click="resetExample"
					>
						Réinitialiser
					</VBtn>       
				</div>
            `,
		}
	},
}

export const messageErreur: Story = {
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
			v-model:error="error"
			v-model:error-messages="errorMessages"
		/>
		<VBtn
			color="primary"
			class="mt-3"
			@click="resetExample"
		>
			Réinitialiser
		</VBtn>       
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
const error = ref(true)
const errorMessages = ref(['Le champ est requis.'])
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
	function resetExample() {
		value.value = null
		error.value = true
		errorMessages.value = [
			'Le champ est requis.',
		]
	}
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
		error: true,
		errorMessages: [
			'Le champ est requis.',
		],
	},
	render: (args) => {
		return {
			components: { SelectBtnField, VBtn },
			setup() {
				const error = ref(args.error)
				const value = ref(args.modelValue)
				const errorMessages = ref(args.errorMessages)

				function resetExample() {
					error.value = true
					value.value = null
					errorMessages.value = ['Le champ est requis.']
				}
				return { args, resetExample, error, value, errorMessages }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						v-model:error="error"
						v-model:error-messages="errorMessages"
					/>
					<VBtn
						color="primary"
						class="mt-3"
						@click="resetExample"
					>
						Réinitialiser
					</VBtn>
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
		modelValue: ['email'],
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

export const Info: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
                <SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false">
                    <template #default>Vous pouvez utiliser le modificateur v-model:error pour réinitialiser l’erreur lorsque l’utilisateur modifie la valeur du champ.
                    </template>
                </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}
