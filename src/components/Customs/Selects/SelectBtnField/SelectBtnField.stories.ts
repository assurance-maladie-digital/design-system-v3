import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from './SelectBtnField.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { VBtn } from 'vuetify/components'
import { ref, watch } from 'vue'

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
			description: 'Valeur utilisée pour l’attribut aria-label, préférer l’utilisation de aria-labelledby pour respecter les impératifs d’accessibilité',
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
		required: {
			control: { type: 'boolean' },
			default: false,
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
			hint="Par défaut, le moyen de contact est l'email."
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
		hint: 'Par défaut, le moyen de contact est l\'email.',
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

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact (obligatoire) :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			required
			v-model:error="error"
			v-model:error-messages="errorMessages"
		/>
		<VBtn
			color="primary"
			class="mt-3"
			@click="validateRequired"
		>
			Valider
		</VBtn>
	</div>
</template>
					`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { SelectBtnField } from '@cnamts/synapse'

	const value = ref(null)
	const error = ref(false)
	const errorMessages = ref<string[] | undefined>(undefined)
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

	function validateRequired() {
		const isEmpty = value.value === null
			|| (Array.isArray(value.value) && value.value.length === 0)

		error.value = isEmpty
		errorMessages.value = isEmpty ? ['Le champ est requis.'] : undefined
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
		required: true,
		error: false,
		errorMessages: undefined,
	},
	render: (args) => {
		return {
			components: { SelectBtnField, VBtn },
			setup() {
				const value = ref(args.modelValue)
				const error = ref(args.error)
				const errorMessages = ref<string[] | undefined>(args.errorMessages)

				function validateRequired() {
					const isEmpty = value.value === null
						|| (Array.isArray(value.value) && value.value.length === 0)

					error.value = isEmpty
					errorMessages.value = isEmpty ? ['Le champ est requis.'] : undefined
				}

				return { args, value, error, errorMessages, validateRequired }
			},
			template: `
				<div style="max-width: 400px">
					<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact (obligatoire) :</h2>
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						:required="args.required"
						v-model:error="error"
						v-model:error-messages="errorMessages"
					/>
					<VBtn
						color="primary"
						class="mt-3"
						@click="validateRequired"
					>
						Valider
					</VBtn>
				</div>
			`,
		}
	},
}

export const WithError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
	<template>
	  <SelectBtnField
	    v-model="value"
	    :items="items"
	    v-model:error="error"
	    v-model:error-messages="errorMessages"
	  />
	</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'
const value = ref(null)
const error = ref(true)
const errorMessages = ref(['Veuillez sélectionner une option'])
const items = [
  { text: 'Email', value: 'email' },
  { text: 'Courrier', value: 'courrier' },
]

watch(value, (nextValue) => {
  const hasSelection = Array.isArray(nextValue)
    ? nextValue.length > 0
    : nextValue !== null && nextValue !== undefined

  error.value = !hasSelection
  errorMessages.value = hasSelection ? undefined : ['Veuillez sélectionner une option']
}, { immediate: true })
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
		],
		error: true,
		errorMessages: ['Veuillez sélectionner une option'],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref(args.modelValue)
			const error = ref(args.error)
			const errorMessages = ref(args.errorMessages)

			watch(value, (nextValue) => {
				const hasSelection = Array.isArray(nextValue)
					? nextValue.length > 0
					: nextValue !== null && nextValue !== undefined

				error.value = !hasSelection
				errorMessages.value = hasSelection ? undefined : ['Veuillez sélectionner une option']
			}, { immediate: true })

			return { args, value, error, errorMessages }
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
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SelectBtnField
    v-model="value"
    :items="items"
    :warning-messages="warningMessages"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'
const value = ref('email')
const warningMessages = ref(['Veuillez confirmer votre choix'])
const items = [
  { text: 'Email', value: 'email' },
  { text: 'Courrier', value: 'courrier' },
]

watch(value, (nextValue) => {
  warningMessages.value = nextValue === null || nextValue === undefined
    ? undefined
    : ['Veuillez confirmer votre choix']
}, { immediate: true })
</script>`,
			},
		],
	},
	args: {
		modelValue: 'email',
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
		],
		warningMessages: ['Veuillez confirmer votre choix'],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref(args.modelValue)
			const warningMessages = ref(args.warningMessages)

			watch(value, (nextValue) => {
				warningMessages.value = nextValue === null || nextValue === undefined
					? undefined
					: args.warningMessages
			}, { immediate: true })

			return { args, value, warningMessages }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<SelectBtnField
					v-model="value"
					:items="args.items"
					:warning-messages="warningMessages"
					aria-labelledby="contact-method"
				/>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SelectBtnField
    v-model="value"
    :items="items"
    :success-messages="successMessages"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, watch } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'
const value = ref('email')
const successMessages = ref(['Sélection valide'])
const items = [
  { text: 'Email', value: 'email' },
  { text: 'Courrier', value: 'courrier' },
]

watch(value, (nextValue) => {
  successMessages.value = nextValue === null || nextValue === undefined
    ? undefined
    : ['Sélection valide']
}, { immediate: true })
</script>`,
			},
		],
	},
	args: {
		modelValue: 'email',
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
		],
		successMessages: ['Sélection valide'],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref(args.modelValue)
			const successMessages = ref(args.successMessages)

			watch(value, (nextValue) => {
				successMessages.value = nextValue === null || nextValue === undefined
					? undefined
					: args.successMessages
			}, { immediate: true })

			return { args, value, successMessages }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<SelectBtnField
					v-model="value"
					:items="args.items"
					:success-messages="successMessages"
					aria-labelledby="contact-method"
				/>
			</div>
		`,
	}),
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
